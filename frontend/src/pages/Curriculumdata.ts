// Comprehensive investment curriculum for international students and beginners
// This is real educational content structured for progressive learning

export interface LessonContent {
    id: string;
    title: string;
    sections: Section[];
    keyTakeaways: string[];
    practiceQuestions: Question[];
  }
  
  export interface Section {
    type: 'text' | 'example' | 'comparison' | 'calculation' | 'warning';
    title?: string;
    content: string;
    details?: string[];
    data?: any;
  }
  
  export interface Question {
    id: string;
    type: 'multiple-choice' | 'true-false' | 'calculation' | 'scenario';
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }
  
  export interface Lesson {
    id: string;
    unitId: string;
    title: string;
    description: string;
    estimatedMinutes: number;
    prerequisites: string[];
    content: LessonContent;
    completed: boolean;
    locked: boolean;
  }
  
  export interface Unit {
    id: string;
    title: string;
    description: string;
    orderIndex: number;
    lessons: Lesson[];
    requiredForNext: boolean;
  }
  
  // UNIT 1: FUNDAMENTALS OF INVESTING
  export const fundamentalsUnit: Unit = {
    id: 'unit-1',
    title: 'Investment Fundamentals',
    description: 'Essential concepts every investor must understand',
    orderIndex: 1,
    requiredForNext: true,
    lessons: [
      {
        id: 'lesson-1-1',
        unitId: 'unit-1',
        title: 'What is Investing?',
        description: 'Understanding how investing differs from saving and why it matters',
        estimatedMinutes: 8,
        prerequisites: [],
        completed: false,
        locked: false,
        content: {
          id: 'content-1-1',
          title: 'What is Investing?',
          sections: [
            {
              type: 'text',
              title: 'The Core Concept',
              content: 'Investing is the act of allocating money or capital with the expectation of generating income or profit over time. Unlike saving, which preserves your money, investing puts your money to work to grow wealth.',
              details: [
                'Saving keeps money safe but offers minimal growth',
                'Investing involves calculated risk for potential returns',
                'The goal is to outpace inflation and build long-term wealth',
                'Time horizon and risk tolerance determine investment strategy'
              ]
            },
            {
              type: 'comparison',
              title: 'Saving vs. Investing',
              content: 'Understanding the fundamental difference',
              data: {
                saving: {
                  purpose: 'Short-term needs and emergencies',
                  timeframe: '0-3 years',
                  risk: 'Very low',
                  returns: '0.5% - 1.5% annually',
                  liquidity: 'Immediate access',
                  examples: 'Checking account, savings account, money market'
                },
                investing: {
                  purpose: 'Long-term wealth building',
                  timeframe: '5+ years',
                  risk: 'Variable (low to high)',
                  returns: '7% - 10% annually (historical average)',
                  liquidity: 'May take days to access',
                  examples: 'Stocks, bonds, ETFs, real estate'
                }
              }
            },
            {
              type: 'example',
              title: 'Real-World Example',
              content: 'Consider $10,000 over 20 years:',
              details: [
                'In a savings account at 1% interest: $12,201',
                'Invested in S&P 500 at 10% average return: $67,275',
                'The difference: $55,074 more through investing',
                'This demonstrates the power of market participation'
              ]
            },
            {
              type: 'warning',
              title: 'Important Considerations',
              content: 'Before investing, ensure you have:',
              details: [
                'Emergency fund covering 3-6 months of expenses',
                'High-interest debt paid off (credit cards, payday loans)',
                'Understanding of your risk tolerance',
                'Clear investment timeline and goals'
              ]
            }
          ],
          keyTakeaways: [
            'Investing is essential for building long-term wealth and outpacing inflation',
            'Different from saving: investing involves risk for potentially higher returns',
            'Time is your greatest advantage when investing',
            'Never invest money you need in the next 3-5 years'
          ],
          practiceQuestions: [
            {
              id: 'q1-1-1',
              type: 'multiple-choice',
              question: 'What is the primary difference between saving and investing?',
              options: [
                'Saving is for rich people, investing is for everyone',
                'Saving preserves money with low risk, investing grows money with higher risk',
                'Saving is illegal, investing is legal',
                'There is no difference between them'
              ],
              correctAnswer: 1,
              explanation: 'Saving focuses on capital preservation with minimal returns and low risk, typically for short-term needs. Investing involves taking calculated risks to potentially generate higher returns over longer periods.',
              difficulty: 'easy'
            },
            {
              id: 'q1-1-2',
              type: 'scenario',
              question: 'You have $5,000 and need to buy a car in 8 months. What should you do?',
              options: [
                'Invest it all in stocks for maximum growth',
                'Keep it in a savings account or money market fund',
                'Buy cryptocurrency',
                'Invest in real estate'
              ],
              correctAnswer: 1,
              explanation: 'With a short time horizon (8 months), you should keep the money in a safe, liquid account. Investing for such a short period exposes you to market volatility risk, potentially leaving you with less money when you need it.',
              difficulty: 'medium'
            },
            {
              id: 'q1-1-3',
              type: 'calculation',
              question: 'If you invest $5,000 at 8% annual return for 10 years, approximately how much will you have? (Use compound interest)',
              options: [
                '$9,000',
                '$10,800',
                '$14,000',
                '$5,400'
              ],
              correctAnswer: 1,
              explanation: 'Using the compound interest formula: $5,000 × (1.08)^10 = approximately $10,794. This demonstrates how compound returns multiply your initial investment over time.',
              difficulty: 'medium'
            }
          ]
        }
      },
      {
        id: 'lesson-1-2',
        unitId: 'unit-1',
        title: 'Risk and Return Relationship',
        description: 'Understanding how risk and potential returns are connected',
        estimatedMinutes: 10,
        prerequisites: ['lesson-1-1'],
        completed: false,
        locked: false,
        content: {
          id: 'content-1-2',
          title: 'Risk and Return Relationship',
          sections: [
            {
              type: 'text',
              title: 'The Risk-Return Tradeoff',
              content: 'In investing, risk and potential return are directly correlated. Higher potential returns come with higher risk, while lower risk investments typically offer lower returns. This is a fundamental principle of finance.',
              details: [
                'Risk is the possibility of losing some or all of your investment',
                'Return is the profit or loss generated from an investment',
                'No investment is completely risk-free, including savings accounts (inflation risk)',
                'Understanding your risk tolerance is crucial for investment success'
              ]
            },
            {
              type: 'comparison',
              title: 'Risk-Return Spectrum',
              content: 'Common investments ordered by risk level',
              data: [
                {
                  asset: 'Government Bonds (Treasury)',
                  risk: 'Very Low',
                  expectedReturn: '2-4%',
                  timeframe: '1-30 years',
                  description: 'Backed by government, virtually no default risk'
                },
                {
                  asset: 'Corporate Bonds (Investment Grade)',
                  risk: 'Low',
                  expectedReturn: '3-6%',
                  timeframe: '1-30 years',
                  description: 'Issued by stable companies, regular income'
                },
                {
                  asset: 'Index Funds (S&P 500)',
                  risk: 'Medium',
                  expectedReturn: '8-10%',
                  timeframe: '5+ years',
                  description: 'Diversified stock market exposure, historical average'
                },
                {
                  asset: 'Individual Stocks (Blue Chip)',
                  risk: 'Medium-High',
                  expectedReturn: 'Variable',
                  timeframe: '3+ years',
                  description: 'Single company risk, but established businesses'
                },
                {
                  asset: 'Small-Cap Stocks',
                  risk: 'High',
                  expectedReturn: 'Highly Variable',
                  timeframe: '5+ years',
                  description: 'Growth potential but higher volatility and risk'
                },
                {
                  asset: 'Cryptocurrencies',
                  risk: 'Very High',
                  expectedReturn: 'Extremely Variable',
                  timeframe: 'Speculative',
                  description: 'Highly volatile, can gain or lose significantly'
                }
              ]
            },
            {
              type: 'text',
              title: 'Types of Investment Risk',
              content: 'Understanding different forms of risk',
              details: [
                'Market Risk: Overall market declines affect your investments',
                'Company Risk: Specific company performance impacts stock value',
                'Inflation Risk: Your purchasing power decreases over time',
                'Liquidity Risk: Difficulty selling an investment quickly',
                'Currency Risk: Exchange rate changes affect international investments',
                'Interest Rate Risk: Rising rates can decrease bond values'
              ]
            },
            {
              type: 'example',
              title: 'Risk Tolerance Assessment',
              content: 'Your risk tolerance depends on several factors:',
              details: [
                'Age: Younger investors can typically take more risk (longer time to recover)',
                'Financial Situation: Stable income allows for more aggressive investing',
                'Investment Timeline: Longer horizons permit higher risk tolerance',
                'Emotional Comfort: Ability to weather market downturns without panic selling',
                'Financial Goals: Aggressive goals may require accepting more risk'
              ]
            },
            {
              type: 'warning',
              title: 'Common Risk Mistakes',
              content: 'Avoid these pitfalls:',
              details: [
                'Taking too much risk because others are doing well',
                'Being too conservative and not beating inflation',
                'Panic selling during market downturns',
                'Investing in what you don\'t understand',
                'Confusing volatility (short-term fluctuations) with actual risk'
              ]
            }
          ],
          keyTakeaways: [
            'Higher potential returns always come with higher risk',
            'Diversification helps manage risk without sacrificing too much return',
            'Your personal risk tolerance should guide investment decisions',
            'Understanding various types of risk helps you make informed choices'
          ],
          practiceQuestions: [
            {
              id: 'q1-2-1',
              type: 'multiple-choice',
              question: 'What is the risk-return tradeoff?',
              options: [
                'Low risk investments always lose money',
                'Higher potential returns typically come with higher risk',
                'Risk and return are not related',
                'High risk investments are always better'
              ],
              correctAnswer: 1,
              explanation: 'The risk-return tradeoff is a fundamental investing principle: to achieve higher potential returns, you must accept higher risk. Conversely, lower risk investments generally offer lower returns.',
              difficulty: 'easy'
            },
            {
              id: 'q1-2-2',
              type: 'scenario',
              question: 'You are 22 years old, just started working, and want to invest for retirement (40+ years away). What risk level is most appropriate?',
              options: [
                'Very low risk - keep everything in savings',
                'Low risk - mostly bonds',
                'Medium to high risk - mostly stocks and index funds',
                'Extremely high risk - only cryptocurrency'
              ],
              correctAnswer: 2,
              explanation: 'With 40+ years until retirement, you have time to weather market fluctuations. A medium to high risk portfolio focused on stocks and index funds is appropriate because you can ride out volatility and benefit from long-term growth.',
              difficulty: 'medium'
            },
            {
              id: 'q1-2-3',
              type: 'multiple-choice',
              question: 'Which of the following is NOT a type of investment risk?',
              options: [
                'Market risk',
                'Inflation risk',
                'Guaranteed profit risk',
                'Liquidity risk'
              ],
              correctAnswer: 2,
              explanation: 'There is no such thing as "guaranteed profit risk" - in fact, guaranteed profits don\'t exist in legitimate investing. All the other options are real types of investment risk.',
              difficulty: 'easy'
            }
          ]
        }
      },
      {
        id: 'lesson-1-3',
        unitId: 'unit-1',
        title: 'Time Value of Money',
        description: 'Why a dollar today is worth more than a dollar tomorrow',
        estimatedMinutes: 12,
        prerequisites: ['lesson-1-1'],
        completed: false,
        locked: false,
        content: {
          id: 'content-1-3',
          title: 'Time Value of Money',
          sections: [
            {
              type: 'text',
              title: 'The Time Value Principle',
              content: 'A dollar today is worth more than a dollar in the future. This is because money available now can be invested to earn returns, creating more money over time. This concept is foundational to all investment decisions.',
              details: [
                'Money loses purchasing power over time due to inflation',
                'Investment opportunities today won\'t exist tomorrow',
                'Earlier investments have more time to compound',
                'Opportunity cost: money not invested today loses potential growth'
              ]
            },
            {
              type: 'text',
              title: 'Compound Interest: The Eighth Wonder',
              content: 'Compound interest is when your investment earnings generate their own earnings. Instead of earning returns only on your initial investment, you earn returns on your returns.',
              details: [
                'Simple Interest: Earn only on principal (initial investment)',
                'Compound Interest: Earn on principal AND accumulated interest',
                'Frequency matters: Daily compounding grows faster than annual',
                'Time is the most powerful factor in compounding'
              ]
            },
            {
              type: 'calculation',
              title: 'Compound Interest Formula',
              content: 'Future Value = Principal × (1 + rate)^years',
              details: [
                'Example: $10,000 at 8% for 30 years',
                'Calculation: $10,000 × (1.08)^30',
                'Result: $100,626',
                'Your $10,000 grew to over $100,000 through compounding alone'
              ]
            },
            {
              type: 'example',
              title: 'The Power of Starting Early',
              content: 'Two investors demonstrate the impact of time:',
              details: [
                'Investor A: Invests $500/month from age 25 to 35 (10 years), then stops. Total invested: $60,000',
                'Investor B: Invests $500/month from age 35 to 65 (30 years). Total invested: $180,000',
                'At age 65 (assuming 8% annual return):',
                'Investor A has: $878,570 (started early, invested less)',
                'Investor B has: $745,179 (started late, invested more)',
                'Investor A comes out ahead despite investing $120,000 LESS due to the extra 10 years of compounding'
              ]
            },
            {
              type: 'text',
              title: 'Inflation: The Silent Wealth Destroyer',
              content: 'Inflation is the rate at which money loses purchasing power. Understanding inflation is crucial for investment planning.',
              details: [
                'Historical US inflation averages 3% annually',
                'At 3% inflation, prices double every 24 years',
                'Your investment must beat inflation to gain real wealth',
                'Real Return = Nominal Return - Inflation Rate',
                'Example: 7% investment return - 3% inflation = 4% real return'
              ]
            },
            {
              type: 'comparison',
              title: 'Impact of Inflation Over Time',
              content: 'What $100 buys today vs. the future',
              data: {
                '10 years': '$74 purchasing power (at 3% inflation)',
                '20 years': '$55 purchasing power',
                '30 years': '$41 purchasing power',
                '40 years': '$31 purchasing power'
              }
            },
            {
              type: 'warning',
              title: 'The Cost of Waiting',
              content: 'Delaying investment decisions has serious consequences:',
              details: [
                'Every year you wait costs exponential growth potential',
                'Cannot make up for lost time by investing more later',
                'Market timing is nearly impossible - time IN the market beats timing',
                'Starting with small amounts is better than waiting to have more money'
              ]
            }
          ],
          keyTakeaways: [
            'Money today is more valuable than the same amount in the future',
            'Compound interest creates exponential growth over time',
            'Starting early is more important than investing large amounts',
            'Inflation erodes purchasing power - investments must outpace it'
          ],
          practiceQuestions: [
            {
              id: 'q1-3-1',
              type: 'multiple-choice',
              question: 'What is compound interest?',
              options: [
                'Interest earned only on the initial investment',
                'Interest earned on both the initial investment and accumulated interest',
                'A type of credit card interest',
                'Interest that never grows'
              ],
              correctAnswer: 1,
              explanation: 'Compound interest means you earn returns not just on your original investment, but also on all the returns that have accumulated over time. This creates exponential growth.',
              difficulty: 'easy'
            },
            {
              id: 'q1-3-2',
              type: 'calculation',
              question: 'You invest $5,000 today at 7% annual return. Approximately how much will you have in 20 years?',
              options: [
                '$12,000',
                '$19,350',
                '$25,000',
                '$8,500'
              ],
              correctAnswer: 1,
              explanation: 'Using compound interest: $5,000 × (1.07)^20 = $19,348. This demonstrates how time multiplies your money through compounding.',
              difficulty: 'medium'
            },
            {
              id: 'q1-3-3',
              type: 'scenario',
              question: 'If inflation is 3% and your investment returns 6%, what is your real return?',
              options: [
                '9%',
                '3%',
                '6%',
                '0%'
              ],
              correctAnswer: 1,
              explanation: 'Real return = Nominal return - Inflation. So 6% - 3% = 3% real return. This is the actual increase in your purchasing power.',
              difficulty: 'medium'
            },
            {
              id: 'q1-3-4',
              type: 'true-false',
              question: 'Starting to invest early with small amounts is better than waiting until you have more money to invest.',
              options: [
                'True',
                'False'
              ],
              correctAnswer: 0,
              explanation: 'True! Time is the most powerful factor in compounding. Starting early, even with small amounts, gives your money more time to grow and compounds far more effectively than larger investments started later.',
              difficulty: 'easy'
            }
          ]
        }
      },
      {
        id: 'lesson-1-4',
        unitId: 'unit-1',
        title: 'Investment Account Types',
        description: 'Understanding different accounts and their tax implications',
        estimatedMinutes: 15,
        prerequisites: ['lesson-1-1'],
        completed: false,
        locked: true,
        content: {
          id: 'content-1-4',
          title: 'Investment Account Types',
          sections: [
            {
              type: 'text',
              title: 'Types of Investment Accounts',
              content: 'The type of account you use is as important as what you invest in. Different accounts have different tax treatments and rules.',
              details: [
                'Account type affects how and when you pay taxes',
                'Some accounts have contribution limits',
                'Withdrawal rules vary significantly',
                'Choosing the right account can save thousands in taxes'
              ]
            },
            {
              type: 'text',
              title: 'Taxable Brokerage Accounts',
              content: 'Standard investment accounts with no special tax treatment',
              details: [
                'No contribution limits - invest as much as you want',
                'No withdrawal restrictions - access money anytime',
                'Pay taxes on dividends and interest annually',
                'Capital gains tax when you sell investments for profit',
                'Long-term gains (held >1 year) taxed at lower rates than short-term',
                'Best for: Goals beyond retirement, after maxing retirement accounts'
              ]
            },
            {
              type: 'text',
              title: '401(k) - Employer Retirement Plans',
              content: 'Retirement accounts offered through your employer',
              details: [
                '2024 contribution limit: $23,000 per year',
                'Pre-tax contributions (traditional) reduce current taxable income',
                'Employer matching = free money (always contribute enough to get full match)',
                'Investments grow tax-free until withdrawal',
                'Withdrawals in retirement taxed as ordinary income',
                'Early withdrawal penalties (10%) before age 59.5',
                'Roth 401(k) option: Pay taxes now, withdraw tax-free in retirement'
              ]
            },
            {
              type: 'text',
              title: 'IRA - Individual Retirement Accounts',
              content: 'Retirement accounts you open yourself',
              details: [
                '2024 contribution limit: $7,000 per year ($8,000 if age 50+)',
                'Traditional IRA: Tax deduction now, pay taxes on withdrawals',
                'Roth IRA: No tax deduction now, tax-free withdrawals in retirement',
                'Roth IRA income limits: Phases out at $153,000 (single) in 2024',
                'Can contribute to both 401(k) and IRA',
                'Early withdrawal penalties apply (with some exceptions)'
              ]
            },
            {
              type: 'comparison',
              title: 'Traditional vs Roth: Which to Choose?',
              content: 'The fundamental difference in tax treatment',
              data: {
                traditional: {
                  taxNow: 'No - tax deduction on contributions',
                  taxLater: 'Yes - pay ordinary income tax on withdrawals',
                  bestFor: 'Higher income now, expect lower income in retirement',
                  example: 'Earn $100k now, expect $50k in retirement'
                },
                roth: {
                  taxNow: 'Yes - no tax deduction on contributions',
                  taxLater: 'No - completely tax-free withdrawals',
                  bestFor: 'Lower income now, expect higher income later',
                  example: 'Earn $50k now as student, expect $100k+ later'
                }
              }
            },
            {
              type: 'text',
              title: 'For International Students',
              content: 'Special considerations for non-US citizens',
              details: [
                'Must have earned income in the US to contribute to IRA',
                'F-1 visa students: Can open accounts if working legally (on-campus, OPT, CPT)',
                'Same contribution limits and rules apply',
                'Consider tax treaty benefits with your home country',
                'W-8BEN form may be required to avoid 30% withholding on dividends',
                'If returning home: Can keep US investment accounts, but consider tax implications',
                'Roth IRA may be better if returning home (tax-free withdrawals)'
              ]
            },
            {
              type: 'example',
              title: 'Account Selection Strategy',
              content: 'Optimal order for most international students:',
              details: [
                '1. Emergency Fund: 3-6 months expenses in savings account (not invested)',
                '2. 401(k) to employer match: Always get free money first',
                '3. Roth IRA: Up to limit ($7,000). Best for young earners',
                '4. Max 401(k): Up to $23,000 if possible',
                '5. Taxable Brokerage: For additional savings beyond retirement limits'
              ]
            },
            {
              type: 'warning',
              title: 'Common Mistakes to Avoid',
              content: 'Account-related pitfalls:',
              details: [
                'Not contributing enough to get full employer 401(k) match',
                'Choosing wrong IRA type for your situation',
                'Early withdrawals triggering penalties and taxes',
                'Over-contributing beyond annual limits (causes penalties)',
                'Not updating beneficiaries on accounts',
                'Forgetting about accounts when changing jobs'
              ]
            }
          ],
          keyTakeaways: [
            'Account type determines tax treatment and access to funds',
            'Always get full employer 401(k) match - it\'s free money',
            'Roth IRA often best for young people and students',
            'International students can invest in US accounts with earned income'
          ],
          practiceQuestions: [
            {
              id: 'q1-4-1',
              type: 'multiple-choice',
              question: 'What is the main advantage of a Roth IRA over a Traditional IRA?',
              options: [
                'Higher contribution limits',
                'Tax-free withdrawals in retirement',
                'Can withdraw anytime without penalty',
                'No income requirements'
              ],
              correctAnswer: 1,
              explanation: 'Roth IRA contributions are made with after-tax dollars, but all withdrawals in retirement are completely tax-free. This is especially valuable if you expect to be in a higher tax bracket later.',
              difficulty: 'medium'
            },
            {
              id: 'q1-4-2',
              type: 'scenario',
              question: 'Your employer offers 100% match on 401(k) contributions up to 5% of salary. You earn $50,000. What should you do first?',
              options: [
                'Save money in a regular bank account',
                'Contribute at least 5% ($2,500) to 401(k) to get full match',
                'Invest everything in a brokerage account',
                'Wait until you earn more money'
              ],
              correctAnswer: 1,
              explanation: 'Employer matching is free money - an instant 100% return. Always contribute enough to get the full match before considering other investments. In this case, contributing $2,500 gets you another $2,500 free.',
              difficulty: 'easy'
            },
            {
              id: 'q1-4-3',
              type: 'multiple-choice',
              question: 'You are an international student on F-1 visa working on-campus. Can you open a Roth IRA?',
              options: [
                'No, only US citizens can open IRAs',
                'Yes, if you have US earned income',
                'Only if you have a green card',
                'No, F-1 students cannot invest'
              ],
              correctAnswer: 1,
              explanation: 'International students can open IRAs if they have earned income in the US (from on-campus work, CPT, or OPT). Your visa status doesn\'t prevent you from investing legally earned money.',
              difficulty: 'medium'
            },
            {
              id: 'q1-4-4',
              type: 'calculation',
              question: 'If you contribute $7,000 to a Roth IRA at age 22, and it grows at 8% annually, approximately how much will you have at age 65 (43 years)?',
              options: [
                '$30,000',
                '$180,000',
                '$220,000',
                '$50,000'
              ],
              correctAnswer: 2,
              explanation: '$7,000 × (1.08)^43 = approximately $220,000. And remember, with a Roth IRA, all of this growth would be completely tax-free when withdrawn in retirement!',
              difficulty: 'hard'
            }
          ]
        }
      }
    ]
  };
  
  // UNIT 2: STOCKS AND EQUITY INVESTING
  export const stocksUnit: Unit = {
    id: 'unit-2',
    title: 'Understanding Stocks',
    description: 'Learn about stock ownership, valuation, and equity investing',
    orderIndex: 2,
    requiredForNext: true,
    lessons: [
      {
        id: 'lesson-2-1',
        unitId: 'unit-2',
        title: 'What Are Stocks?',
        description: 'Understanding company ownership through stocks',
        estimatedMinutes: 10,
        prerequisites: ['lesson-1-4'],
        completed: false,
        locked: true,
        content: {
          id: 'content-2-1',
          title: 'What Are Stocks?',
          sections: [
            {
              type: 'text',
              title: 'Stock Ownership Fundamentals',
              content: 'A stock (also called a share or equity) represents partial ownership in a company. When you buy stock, you become a shareholder and own a small piece of that business.',
              details: [
                'Each share represents fractional ownership of the company',
                'Shareholders are part-owners, entitled to company profits',
                'Two ways to make money: price appreciation and dividends',
                'Share price reflects investor sentiment about company value',
                'Public companies have millions or billions of shares outstanding'
              ]
            },
            {
              type: 'text',
              title: 'How Companies Issue Stock',
              content: 'Companies go public through an Initial Public Offering (IPO)',
              details: [
                'Private companies are owned by founders and early investors',
                'IPO allows companies to raise capital by selling shares to public',
                'Stock exchanges (NYSE, NASDAQ) facilitate buying and selling',
                'After IPO, share price determined by market supply and demand',
                'Secondary market: investors trade with each other, not the company'
              ]
            },
            {
              type: 'example',
              title: 'Real Example: Apple Inc. (AAPL)',
              content: 'Understanding shares through a major company',
              details: [
                'Apple has approximately 15.5 billion shares outstanding',
                'At $180 per share, market capitalization = $2.79 trillion',
                'If you own 100 shares, you own 0.0000006% of Apple',
                'Apple pays quarterly dividends (about $0.24 per share)',
                '100 shares would receive $96 in annual dividends',
                'Stock price can fluctuate based on earnings, news, economy'
              ]
            },
            {
              type: 'text',
              title: 'Types of Stocks',
              content: 'Not all stocks are the same',
              details: [
                'Common Stock: Standard shares with voting rights',
                'Preferred Stock: Higher claim on assets, fixed dividends, usually no voting',
                'Blue Chip Stocks: Large, stable, established companies (Microsoft, Coca-Cola)',
                'Growth Stocks: Companies expected to grow faster than market average',
                'Value Stocks: Undervalued companies trading below intrinsic value',
                'Dividend Stocks: Companies that regularly return profits to shareholders',
                'Small-Cap: Companies worth under $2 billion (higher risk/reward)',
                'Large-Cap: Companies worth over $10 billion (more stable)'
              ]
            },
            {
              type: 'text',
              title: 'How Stock Prices Are Determined',
              content: 'Stock prices reflect supply and demand dynamics',
              details: [
                'More buyers than sellers = price rises',
                'More sellers than buyers = price falls',
                'Company earnings reports heavily influence prices',
                'Economic indicators affect overall market sentiment',
                'News, rumors, and speculation create volatility',
                'Long-term: Price tends to follow company fundamentals'
              ]
            },
            {
              type: 'warning',
              title: 'Stock Market Risks',
              content: 'Important realities of stock investing:',
              details: [
                'Stock prices can be volatile in short-term',
                'Individual company risk: Business can fail completely',
                'Market risk: Entire market can decline (2008, 2020)',
                'No guaranteed returns - you can lose money',
                'Emotional decision-making leads to poor results',
                'Short-term trading usually underperforms buy-and-hold'
              ]
            }
          ],
          keyTakeaways: [
            'Stocks represent partial ownership in companies',
            'Profit from stock appreciation and/or dividends',
            'Stock prices determined by supply, demand, and company performance',
            'Different types of stocks serve different investment strategies'
          ],
          practiceQuestions: [
            {
              id: 'q2-1-1',
              type: 'multiple-choice',
              question: 'What does owning a stock represent?',
              options: [
                'Lending money to a company',
                'Owning a piece of the company',
                'Having a job at the company',
                'Guaranteed profits from the company'
              ],
              correctAnswer: 1,
              explanation: 'When you own stock, you are a partial owner of that company. You share in the company\'s success (or failure) through stock price changes and potentially dividends.',
              difficulty: 'easy'
            },
            {
              id: 'q2-1-2',
              type: 'scenario',
              question: 'A company has 10 million shares outstanding at $50 per share. What is the company\'s market capitalization?',
              options: [
                '$50 million',
                '$500 million',
                '$10 million',
                '$5 billion'
              ],
              correctAnswer: 1,
              explanation: 'Market capitalization = Shares Outstanding × Price per Share. So 10 million shares × $50 = $500 million. This represents the total value of all company shares.',
              difficulty: 'medium'
            },
            {
              id: 'q2-1-3',
              type: 'multiple-choice',
              question: 'What is the primary difference between common and preferred stock?',
              options: [
                'Common stock is better than preferred',
                'Preferred stock typically pays fixed dividends and has priority in bankruptcy',
                'They are exactly the same',
                'Preferred stock always goes up in value'
              ],
              correctAnswer: 1,
              explanation: 'Preferred stock generally pays fixed dividends and has priority over common stock in bankruptcy. However, preferred shareholders typically don\'t have voting rights.',
              difficulty: 'medium'
            }
          ]
        }
      }
    ]
  };
  
  // UNIT 3: BONDS AND FIXED INCOME
  export const bondsUnit: Unit = {
    id: 'unit-3',
    title: 'Bonds and Fixed Income',
    description: 'Understanding debt instruments and conservative investments',
    orderIndex: 3,
    requiredForNext: false,
    lessons: [
      {
        id: 'lesson-3-1',
        unitId: 'unit-3',
        title: 'Bond Basics',
        description: 'How bonds work and why investors use them',
        estimatedMinutes: 12,
        prerequisites: ['lesson-2-1'],
        completed: false,
        locked: true,
        content: {
          id: 'content-3-1',
          title: 'Bond Basics',
          sections: [
            {
              type: 'text',
              title: 'What Is a Bond?',
              content: 'A bond is essentially a loan you make to a company or government. In return, they promise to pay you interest and return your principal at maturity.',
              details: [
                'Bonds are debt instruments - you are the lender',
                'Issuer (borrower) pays regular interest (coupon payments)',
                'Principal (face value) returned at maturity date',
                'Generally less risky than stocks but lower returns',
                'Provides predictable income stream',
                'Important for portfolio diversification'
              ]
            },
            {
              type: 'text',
              title: 'Key Bond Terms',
              content: 'Essential vocabulary for bond investing',
              details: [
                'Face Value (Par): Amount paid back at maturity (usually $1,000)',
                'Coupon Rate: Annual interest rate paid by bond',
                'Maturity Date: When principal is repaid',
                'Yield: Actual return considering current price',
                'Credit Rating: Assessment of issuer\'s ability to repay',
                'Duration: Sensitivity to interest rate changes'
              ]
            },
            {
              type: 'example',
              title: 'Bond Example',
              content: 'Understanding a real bond investment',
              details: [
                'You buy a $1,000 bond with 5% coupon, 10-year maturity',
                'You pay $1,000 upfront',
                'Receive $50 per year (5% of $1,000) in interest',
                'After 10 years, receive your $1,000 principal back',
                'Total received: $500 interest + $1,000 principal = $1,500',
                'Net profit: $500 over 10 years'
              ]
            },
            {
              type: 'text',
              title: 'Types of Bonds',
              content: 'Different bond categories for different needs',
              details: [
                'US Treasury Bonds: Safest, backed by government, lowest yield',
                'Corporate Bonds: Higher yield, risk depends on company credit rating',
                'Municipal Bonds: Issued by states/cities, often tax-free',
                'Investment Grade: BBB- rating or higher, lower risk',
                'Junk Bonds: Below investment grade, higher risk and yield',
                'International Bonds: Foreign government or corporate debt'
              ]
            },
            {
              type: 'text',
              title: 'Bond Risks',
              content: 'Bonds are not risk-free',
              details: [
                'Interest Rate Risk: Rising rates decrease bond values',
                'Credit Risk: Issuer may default on payments',
                'Inflation Risk: Fixed payments lose purchasing power',
                'Liquidity Risk: Some bonds hard to sell quickly',
                'Call Risk: Issuer may repay bond early when rates drop'
              ]
            }
          ],
          keyTakeaways: [
            'Bonds are loans to companies or governments',
            'Provide regular income through interest payments',
            'Generally less risky than stocks but lower returns',
            'Important component of balanced portfolio'
          ],
          practiceQuestions: [
            {
              id: 'q3-1-1',
              type: 'multiple-choice',
              question: 'What is a bond?',
              options: [
                'Partial ownership in a company',
                'A loan you make to a company or government',
                'A type of savings account',
                'A guarantee to make money'
              ],
              correctAnswer: 1,
              explanation: 'A bond is a debt instrument - you lend money to the issuer (company or government) and they pay you interest plus return your principal at maturity.',
              difficulty: 'easy'
            },
            {
              id: 'q3-1-2',
              type: 'calculation',
              question: 'You buy a $1,000 bond with a 6% coupon rate. How much interest do you receive annually?',
              options: [
                '$6',
                '$60',
                '$600',
                '$1,060'
              ],
              correctAnswer: 1,
              explanation: 'Coupon payment = Face Value × Coupon Rate. So $1,000 × 0.06 = $60 per year. This is your annual interest income from the bond.',
              difficulty: 'easy'
            },
            {
              id: 'q3-1-3',
              type: 'multiple-choice',
              question: 'What happens to existing bond prices when interest rates rise?',
              options: [
                'Bond prices stay the same',
                'Bond prices increase',
                'Bond prices decrease',
                'Bonds stop paying interest'
              ],
              correctAnswer: 2,
              explanation: 'When interest rates rise, existing bonds with lower rates become less attractive. Their prices fall so that their yield becomes competitive with new higher-rate bonds.',
              difficulty: 'medium'
            }
          ]
        }
      }
    ]
  };
  
  // UNIT 4: ETFs AND MUTUAL FUNDS
  export const fundsUnit: Unit = {
    id: 'unit-4',
    title: 'ETFs and Mutual Funds',
    description: 'Diversified investing through funds',
    orderIndex: 4,
    requiredForNext: false,
    lessons: [
      {
        id: 'lesson-4-1',
        unitId: 'unit-4',
        title: 'Introduction to ETFs',
        description: 'Understanding Exchange-Traded Funds',
        estimatedMinutes: 10,
        prerequisites: ['lesson-2-1'],
        completed: false,
        locked: true,
        content: {
          id: 'content-4-1',
          title: 'Introduction to ETFs',
          sections: [
            {
              type: 'text',
              title: 'What Are ETFs?',
              content: 'Exchange-Traded Funds (ETFs) are investment funds that trade on stock exchanges, holding multiple assets like stocks or bonds. They provide instant diversification.',
              details: [
                'One ETF can hold hundreds or thousands of securities',
                'Trade like stocks throughout the day',
                'Lower fees than actively managed mutual funds',
                'Tax efficient compared to mutual funds',
                'Provide exposure to entire markets or sectors',
                'Ideal for beginner investors seeking diversification'
              ]
            },
            {
              type: 'example',
              title: 'Popular ETF Example: SPY (SPDR S&P 500)',
              content: 'Understanding through the most popular ETF',
              details: [
                'Tracks the S&P 500 index - 500 largest US companies',
                'One share gives exposure to entire index',
                'Expense ratio: 0.09% (very low)',
                'Holdings include Apple, Microsoft, Amazon, etc.',
                'Historical return: ~10% annually over long term',
                'Over $400 billion in assets'
              ]
            },
            {
              type: 'text',
              title: 'Types of ETFs',
              content: 'ETFs for every investment strategy',
              details: [
                'Broad Market ETFs: Total market exposure (VTI, VOO)',
                'Sector ETFs: Specific industries (XLK for tech, XLF for finance)',
                'International ETFs: Foreign markets (VXUS, EEM)',
                'Bond ETFs: Fixed income exposure (BND, AGG)',
                'Commodity ETFs: Gold, oil, etc. (GLD, USO)',
                'Thematic ETFs: Specific trends (clean energy, AI)',
                'Smart Beta ETFs: Alternative weighting strategies'
              ]
            },
            {
              type: 'comparison',
              title: 'ETFs vs. Mutual Funds',
              content: 'Key differences between the two fund types',
              data: {
                etfs: {
                  trading: 'Trade throughout day like stocks',
                  minimums: 'No minimum (just cost of one share)',
                  fees: 'Generally lower (0.03% - 0.50%)',
                  taxes: 'More tax efficient',
                  management: 'Mostly passive (index tracking)'
                },
                mutualFunds: {
                  trading: 'Trade once per day at closing price',
                  minimums: 'Often $1,000 - $3,000 minimum',
                  fees: 'Generally higher (0.50% - 2.00%+)',
                  taxes: 'Less tax efficient',
                  management: 'Often actively managed'
                }
              }
            },
            {
              type: 'text',
              title: 'Building a Simple ETF Portfolio',
              content: 'Three-fund portfolio approach',
              details: [
                '60% US Total Stock Market ETF (VTI)',
                '30% International Stock ETF (VXUS)',
                '10% Bond ETF (BND)',
                'This simple portfolio provides global diversification',
                'Adjust percentages based on age and risk tolerance',
                'Rebalance annually to maintain target allocations'
              ]
            },
            {
              type: 'warning',
              title: 'ETF Considerations',
              content: 'Important factors to understand',
              details: [
                'Pay attention to expense ratios - they compound over time',
                'Avoid niche or exotic ETFs as beginner',
                'Volume matters - low trading volume can mean wider spreads',
                'Some ETFs use leverage (2x, 3x) - very risky',
                'Don\'t confuse ETF safety with diversification',
                'Index ETFs generally outperform actively managed funds'
              ]
            }
          ],
          keyTakeaways: [
            'ETFs provide instant diversification in a single investment',
            'Lower fees and tax efficiency compared to mutual funds',
            'Ideal for beginners building balanced portfolios',
            'Start with broad market index ETFs'
          ],
          practiceQuestions: [
            {
              id: 'q4-1-1',
              type: 'multiple-choice',
              question: 'What is the main advantage of ETFs for beginners?',
              options: [
                'They guarantee profits',
                'They provide instant diversification across many stocks',
                'They never lose value',
                'They require no research'
              ],
              correctAnswer: 1,
              explanation: 'ETFs hold many different securities in one fund, providing instant diversification. Instead of buying many individual stocks, one ETF gives you exposure to hundreds or thousands of companies.',
              difficulty: 'easy'
            },
            {
              id: 'q4-1-2',
              type: 'scenario',
              question: 'You have $1,000 to invest and want broad US market exposure. Which is most appropriate?',
              options: [
                'Buy stock in one company like Apple',
                'Buy an S&P 500 ETF like VOO or SPY',
                'Buy 10 different individual stocks',
                'Keep it in savings account'
              ],
              correctAnswer: 1,
              explanation: 'An S&P 500 ETF gives you exposure to 500 large companies with one purchase, providing excellent diversification. This is more efficient and less risky than picking individual stocks.',
              difficulty: 'easy'
            },
            {
              id: 'q4-1-3',
              type: 'multiple-choice',
              question: 'What does an expense ratio of 0.10% mean?',
              options: [
                'You pay $10 per trade',
                'You pay 0.10% of your investment annually in fees',
                'You earn 0.10% interest',
                'You must invest minimum of $10'
              ],
              correctAnswer: 1,
              explanation: 'Expense ratio is the annual fee charged by the fund. 0.10% means you pay $1 per year for every $1,000 invested. Lower is better - it means more of your returns stay with you.',
              difficulty: 'medium'
            }
          ]
        }
      }
    ]
  };
  
  export const allUnits: Unit[] = [
    fundamentalsUnit,
    stocksUnit,
    bondsUnit,
    fundsUnit
  ];