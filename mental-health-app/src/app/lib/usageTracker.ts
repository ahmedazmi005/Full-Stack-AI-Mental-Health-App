// Shared usage tracking (in production, use a database)
let dailyRequests = 0
let monthlyRequests = 0
let dailyCost = 0
let monthlyCost = 0
let lastResetDate = new Date().toDateString()
let lastMonthlyReset = new Date().getMonth()

const COST_PER_1K_TOKENS = 0.002 // GPT-3.5-turbo pricing
const MAX_DAILY_REQUESTS = 50
const MAX_MONTHLY_COST = 20

function resetCountersIfNeeded() {
  const today = new Date().toDateString()
  const currentMonth = new Date().getMonth()
  
  if (lastResetDate !== today) {
    dailyRequests = 0
    dailyCost = 0
    lastResetDate = today
  }
  
  if (lastMonthlyReset !== currentMonth) {
    monthlyRequests = 0
    monthlyCost = 0
    lastMonthlyReset = currentMonth
  }
}

export const usageTracker = {
  // Get current stats
  getStats: () => {
    resetCountersIfNeeded()
    return {
      requestsToday: dailyRequests,
      estimatedCostToday: dailyCost,
      requestsThisMonth: monthlyRequests,
      estimatedCostThisMonth: monthlyCost
    }
  },

  // Check if request can be made
  canMakeRequest: () => {
    resetCountersIfNeeded()
    return {
      allowed: dailyRequests < MAX_DAILY_REQUESTS && monthlyCost < MAX_MONTHLY_COST,
      reason: dailyRequests >= MAX_DAILY_REQUESTS 
        ? 'Daily request limit exceeded'
        : monthlyCost >= MAX_MONTHLY_COST 
        ? 'Monthly cost limit exceeded'
        : null
    }
  },

  // Record a request
  recordRequest: (tokensUsed: number) => {
    resetCountersIfNeeded()
    const requestCost = (tokensUsed / 1000) * COST_PER_1K_TOKENS
    
    dailyRequests++
    monthlyRequests++
    dailyCost += requestCost
    monthlyCost += requestCost

    console.log(`API Call - Tokens: ${tokensUsed}, Cost: $${requestCost.toFixed(4)}, Daily Total: $${dailyCost.toFixed(4)}`)
    
    return {
      requestCost,
      dailyTotal: dailyCost,
      monthlyTotal: monthlyCost
    }
  }
} 