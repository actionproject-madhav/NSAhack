from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from PIL import Image, ImageEnhance
import pytesseract
import re
import io
from datetime import datetime
from database import ReceiptDatabase
import uuid

app = Flask(__name__)
CORS(app)

# Initialize database
db = ReceiptDatabase()

def enhance_receipt_image(image):
    """Enhanced preprocessing for better OCR"""
    # Convert to OpenCV
    opencv_img = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(opencv_img, cv2.COLOR_BGR2GRAY)
    
    # Resize to optimal size for OCR
    height, width = gray.shape
    target_height = 1500
    if height < target_height:
        scale = target_height / height
        new_width = int(width * scale)
        gray = cv2.resize(gray, (new_width, target_height), interpolation=cv2.INTER_CUBIC)
    
    # Advanced denoising
    denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)
    
    # Gaussian blur
    blurred = cv2.GaussianBlur(denoised, (1, 1), 0)
    
    # Enhanced contrast
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    enhanced = clahe.apply(blurred)
    
    # Morphological operations
    kernel = np.ones((1,1), np.uint8)
    morph = cv2.morphologyEx(enhanced, cv2.MORPH_CLOSE, kernel)
    
    # Adaptive threshold
    binary = cv2.adaptiveThreshold(
        morph, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
        cv2.THRESH_BINARY, 15, 4
    )
    
    # Cleanup
    kernel = np.ones((2,2), np.uint8)
    cleaned = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)
    
    return cleaned

def extract_text_robust(processed_img):
    """Multi-pass OCR extraction"""
    psm_modes = [6, 4, 8, 11, 13, 3]
    oem_modes = [3, 1, 2]
    
    all_results = []
    
    for oem in oem_modes:
        for psm in psm_modes:
            try:
                config = f'--oem {oem} --psm {psm} -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,$/():- '
                text = pytesseract.image_to_string(processed_img, config=config)
                
                if text.strip() and len(text.strip()) > 20:
                    all_results.append({
                        'text': text.strip(),
                        'length': len(text.strip()),
                        'oem': oem,
                        'psm': psm
                    })
            except Exception as e:
                continue
    
    if not all_results:
        return ""
    
    # Return the longest result
    best_result = max(all_results, key=lambda x: x['length'])
    print(f"Best OCR: OEM {best_result['oem']}, PSM {best_result['psm']}, Length: {best_result['length']}")
    return best_result['text']

def find_company_name(text):
    """Find company name with improved logic"""
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    # Patterns to skip
    skip_patterns = [
        r'^\d+\s+.*(?:street|st|avenue|ave|road|rd|boulevard|blvd)',
        r'^\(\d{3}\)\s*\d{3}-\d{4}',
        r'^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}',
        r'^store\s*#?\d+',
        r'^\d{1,2}:\d{2}',
        r'^\$\d+\.?\d*',
        r'^receipt\s*#?\d*',
        r'^transaction\s*#?\d*',
        r'^cashier:?\s*\w+',
        r'^terminal:?\s*\d+',
        r'^card\s*#?\*+\d+',
        r'^\*+\d{4}$',
        r'^auth\s*code:?\s*\d+',
        r'^ref\s*#?\d+'
    ]
    
    potential_companies = []
    
    for i, line in enumerate(lines[:12]):
        line_clean = line.strip()
        
        if len(line_clean) < 3:
            continue
            
        # Skip patterns
        skip = False
        for pattern in skip_patterns:
            if re.match(pattern, line_clean, re.IGNORECASE):
                skip = True
                break
        if skip:
            continue
        
        # Skip numbers only or common words
        if re.match(r'^[\d\s\.\-\(\)]+$', line_clean):
            continue
            
        if line_clean.lower() in ['receipt', 'thank you', 'thanks', 'visit', 'again', 'customer', 'copy']:
            continue
        
        # Good company name indicators
        if (len(line_clean) >= 4 and 
            not re.match(r'^\d+$', line_clean) and
            not re.match(r'^\d+\.\d+$', line_clean) and
            any(c.isalpha() for c in line_clean)):
            
            clean_name = re.sub(r'[^\w\s&\'-]', ' ', line_clean)
            clean_name = ' '.join(clean_name.split())
            
            # Score the company name
            score = 0
            if i < 3:
                score += 10
            if len(clean_name.split()) <= 4:
                score += 5
            if clean_name.upper() == clean_name:
                score += 3
            if any(word in clean_name.upper() for word in ['STORE', 'MARKET', 'SHOP', 'FOODS', 'MART']):
                score += 5
                
            potential_companies.append({
                'name': clean_name.title(),
                'score': score,
                'position': i
            })
    
    if potential_companies:
        best = max(potential_companies, key=lambda x: x['score'])
        return best['name']
    
    return "Unknown Store"

def find_total_amount(text):
    """Find total amount with better patterns"""
    
    # Total patterns
    total_patterns = [
        r'(?i)(?:total|amount\s*due|balance\s*due|grand\s*total)\s*:?\s*\$?(\d{1,4}\.\d{2})',
        r'(?i)total\s*\$?(\d{1,4}\.\d{2})',
        r'(?i)\$(\d{1,4}\.\d{2})\s*(?:total|due)',
        r'(?i)(?:final|net)\s*(?:total|amount)\s*:?\s*\$?(\d{1,4}\.\d{2})',
        r'(?i)amount\s*:?\s*\$?(\d{1,4}\.\d{2})'
    ]
    
    found_amounts = []
    
    # Look for explicit patterns
    for pattern in total_patterns:
        matches = re.findall(pattern, text)
        for match in matches:
            try:
                amount = float(match)
                if 0.50 <= amount <= 9999.99:
                    found_amounts.append(amount)
            except:
                continue
    
    if found_amounts:
        return max(found_amounts)
    
    # Look near total-related words
    lines = text.split('\n')
    for i, line in enumerate(lines):
        if re.search(r'\b(?:total|amount|due|balance|grand)\b', line, re.IGNORECASE):
            search_lines = lines[max(0, i-1):i+3]
            for search_line in search_lines:
                amounts = re.findall(r'\$(\d{1,4}\.\d{2})', search_line)
                for amount in amounts:
                    try:
                        val = float(amount)
                        if 1.00 <= val <= 9999.99:
                            found_amounts.append(val)
                    except:
                        continue
    
    if found_amounts:
        return max(found_amounts)
    
    # Last resort: largest reasonable amount
    all_amounts = re.findall(r'\$(\d{1,4}\.\d{2})', text)
    valid_amounts = []
    
    for amount in all_amounts:
        try:
            val = float(amount)
            if 5.00 <= val <= 999.99:
                valid_amounts.append(val)
        except:
            continue
    
    return max(valid_amounts) if valid_amounts else 0.0

@app.route('/api/scan-receipt', methods=['POST'])
def scan_receipt():
    try:
        if 'receipt' not in request.files:
            return jsonify({'error': 'No file uploaded', 'success': False}), 400
        
        file = request.files['receipt']
        if not file or file.filename == '':
            return jsonify({'error': 'No file selected', 'success': False}), 400

        # Get user_id from request (you can modify this based on your auth system)
        user_id = request.form.get('user_id', 'anonymous_user')
        
        # Process image
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        print(f"Processing receipt for user: {user_id}")
        
        # Enhanced preprocessing
        processed_image = enhance_receipt_image(image)
        
        # Extract text
        extracted_text = extract_text_robust(processed_image)
        
        print("=== EXTRACTED TEXT ===")
        print(extracted_text)
        print("=== END TEXT ===")
        
        if not extracted_text or len(extracted_text.strip()) < 10:
            return jsonify({
                'success': False,
                'error': 'Could not extract readable text. Please try a clearer image.',
                'extracted_text': extracted_text
            }), 400
        
        # Parse results
        company_name = find_company_name(extracted_text)
        total_amount = find_total_amount(extracted_text)
        
        # Calculate confidence
        confidence_score = 100
        
        if company_name == "Unknown Store":
            confidence_score -= 40
        if total_amount == 0.0:
            confidence_score -= 50
        if len(extracted_text.strip()) < 100:
            confidence_score -= 20
            
        if confidence_score >= 80:
            confidence = "high"
        elif confidence_score >= 50:
            confidence = "medium"
        else:
            confidence = "low"
        
        print(f"Results: Company='{company_name}', Amount=${total_amount}, Confidence={confidence}")
        
        # Save to database
        scan_metadata = {
            'file_name': file.filename,
            'file_size': len(image_bytes),
            'processing_time': datetime.now().isoformat()
        }
        
        receipt_id = db.save_receipt_scan(
            user_id=user_id,
            company_name=company_name,
            total_amount=total_amount,
            confidence=confidence,
            extracted_text=extracted_text,
            scan_metadata=scan_metadata
        )
        
        response_data = {
            'success': True,
            'company_name': company_name,
            'total_amount': total_amount,
            'confidence': confidence,
            'extracted_text': extracted_text
        }
        
        if receipt_id:
            response_data['receipt_id'] = receipt_id
        
        return jsonify(response_data)
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Processing error: {str(e)}'
        }), 500

# Dashboard API endpoints
@app.route('/api/dashboard/receipts/<user_id>', methods=['GET'])
def get_user_receipts(user_id):
    """Get all receipts for a user"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        skip = (page - 1) * limit
        
        receipts = db.get_user_receipts(user_id, limit=limit, skip=skip)
        
        return jsonify({
            'success': True,
            'receipts': receipts,
            'page': page,
            'limit': limit
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/dashboard/stats/<user_id>', methods=['GET'])
def get_user_stats(user_id):
    """Get dashboard statistics for a user"""
    try:
        stats = db.get_user_stats(user_id)
        
        if stats is None:
            return jsonify({
                'success': False,
                'error': 'Failed to get user statistics'
            }), 500
        
        return jsonify({
            'success': True,
            'stats': stats
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/dashboard/companies/<user_id>', methods=['GET'])
def get_company_breakdown(user_id):
    """Get spending breakdown by company"""
    try:
        companies = db.get_company_breakdown(user_id)
        
        return jsonify({
            'success': True,
            'companies': companies
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/dashboard/monthly/<user_id>', methods=['GET'])
def get_monthly_spending(user_id):
    """Get monthly spending trends"""
    try:
        months = int(request.args.get('months', 12))
        monthly_data = db.get_monthly_spending(user_id, months=months)
        
        return jsonify({
            'success': True,
            'monthly_data': monthly_data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/receipts/<receipt_id>', methods=['DELETE'])
def delete_receipt(receipt_id):
    """Delete a receipt"""
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({
                'success': False,
                'error': 'user_id is required'
            }), 400
        
        success = db.delete_receipt(receipt_id, user_id)
        
        return jsonify({
            'success': success,
            'message': 'Receipt deleted successfully' if success else 'Failed to delete receipt'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/receipts/<receipt_id>', methods=['PUT'])
def update_receipt(receipt_id):
    """Update a receipt (manual correction)"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({
                'success': False,
                'error': 'user_id is required'
            }), 400
        
        # Extract updatable fields
        updates = {}
        if 'company_name' in data:
            updates['company_name'] = data['company_name']
        if 'total_amount' in data:
            updates['total_amount'] = float(data['total_amount'])
        if 'confidence' in data:
            updates['confidence'] = data['confidence']
        
        success = db.update_receipt(receipt_id, user_id, updates)
        
        return jsonify({
            'success': success,
            'message': 'Receipt updated successfully' if success else 'Failed to update receipt'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'database': 'connected' if db.client else 'disconnected'})

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Receipt Scanner API with MongoDB is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)