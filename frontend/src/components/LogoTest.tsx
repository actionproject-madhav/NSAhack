import React from 'react'

const LogoTest = () => {
  const testCompanies = ['Apple', 'Google', 'Amazon', 'Tesla', 'Netflix']
  const apiKey = 'pk_P_BXl4cLSeK5GysWppL1Og'
  
  return (
    <div className="p-4 bg-white rounded-lg">
      <h3 className="text-lg font-bold mb-4">Logo API Test</h3>
      <div className="grid grid-cols-5 gap-4">
        {testCompanies.map(company => {
          const domain = company.toLowerCase() + '.com'
          const logoUrl = `https://img.logo.dev/${domain}?token=${apiKey}&size=64&format=png`
          
          return (
            <div key={company} className="text-center">
              <div className="w-16 h-16 border rounded-lg flex items-center justify-center mb-2">
                <img 
                  src={logoUrl} 
                  alt={`${company} logo`}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    console.log(`Failed to load logo for ${company}:`, logoUrl)
                    e.currentTarget.style.display = 'none'
                  }}
                  onLoad={() => console.log(`Successfully loaded logo for ${company}`)}
                />
              </div>
              <p className="text-xs">{company}</p>
              <p className="text-xs text-gray-500">{domain}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LogoTest