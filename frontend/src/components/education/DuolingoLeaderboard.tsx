import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LeaderboardEntry {
  rank: number
  name: string
  xp: number
  avatar: string
  isCurrentUser?: boolean
}

type League = 'bronze' | 'silver' | 'gold' | 'sapphire' | 'ruby' | 'emerald' | 'amethyst' | 'pearl' | 'obsidian' | 'diamond'
type TimeFilter = 'week' | 'month' | 'allTime'

const DuolingoLeaderboard = () => {
  const [currentLeague, setCurrentLeague] = useState<League>('bronze')
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week')

  const leagues = {
    bronze: { name: 'Bronze League', color: '#CD7F32', icon: '' },
    silver: { name: 'Silver League', color: '#C0C0C0', icon: '' },
    gold: { name: 'Gold League', color: '#FFD700', icon: '' },
    sapphire: { name: 'Sapphire League', color: '#0F52BA', icon: '' },
    ruby: { name: 'Ruby League', color: '#E0115F', icon: '' },
    emerald: { name: 'Emerald League', color: '#50C878', icon: '' },
    amethyst: { name: 'Amethyst League', color: '#9966CC', icon: '' },
    pearl: { name: 'Pearl League', color: '#F0EAD6', icon: '' },
    obsidian: { name: 'Obsidian League', color: '#3D3D3D', icon: '' },
    diamond: { name: 'Diamond League', color: '#B9F2FF', icon: '' }
  }

  useEffect(() => {
    // Fetch leaderboard data
    fetchLeaderboardData()
  }, [timeFilter])

  const fetchLeaderboardData = async () => {
    // Mock data for now
    const mockData = [
      { rank: 1, name: 'You', xp: 2500, avatar: '', isCurrentUser: true },
      { rank: 2, name: 'Alex Chen', xp: 2450, avatar: '' },
      { rank: 3, name: 'Maria Silva', xp: 2400, avatar: '' },
      { rank: 4, name: 'John Doe', xp: 2350, avatar: '' },
      { rank: 5, name: 'Emma Wilson', xp: 2300, avatar: '' },
      // ... more users
    ]
    setLeaderboardData(mockData)
  }

  return (
    <div className="duo-leaderboard">
      {/* Header */}
      <div className="duo-leaderboard-header">
        <div className="league-info">
          <span className="league-icon">{leagues[currentLeague].icon}</span>
          <h2>{leagues[currentLeague].name}</h2>
        </div>
        
        {/* Time Filter Tabs */}
        <div className="time-filter-tabs">
          {(['week', 'month', 'allTime'] as TimeFilter[]).map(filter => (
            <button
              key={filter}
              className={`tab ${timeFilter === filter ? 'active' : ''}`}
              onClick={() => setTimeFilter(filter)}
            >
              {filter === 'week' ? 'This Week' : 
               filter === 'month' ? 'This Month' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Promotion/Demotion Zone */}
      <div className="league-zones">
        <div className="promotion-zone">
          <span className="zone-icon"></span>
          <span>Top 10 advance to {leagues[getNextLeague(currentLeague)]?.name}</span>
        </div>
        <div className="safe-zone">
          <span className="zone-icon"></span>
          <span>Safe zone</span>
        </div>
        <div className="demotion-zone">
          <span className="zone-icon"></span>
          <span>Bottom 5 go to {leagues[getPrevLeague(currentLeague)]?.name}</span>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="leaderboard-list">
        <AnimatePresence>
          {leaderboardData.map((user, index) => (
            <motion.div
              key={user.rank}
              className={`leaderboard-item ${user.isCurrentUser ? 'current-user' : ''} ${
                index < 3 ? 'top-three' : ''
              } ${index < 10 ? 'promotion' : index >= 45 ? 'demotion' : 'safe'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="rank-badge">
                {user.rank}
              </div>
              
              <div className="user-info">
                <div className="avatar">{user.avatar}</div>
                <span className="username">{user.name}</span>
              </div>
              
              <div className="xp-info">
                <span className="xp-amount">{user.xp.toLocaleString()}</span>
                <span className="xp-label">XP</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom Stats */}
      <div className="leaderboard-footer">
        <div className="stat">
          <span className="stat-label">Your Rank</span>
          <span className="stat-value">#1</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total XP</span>
          <span className="stat-value">2,500</span>
        </div>
        <div className="stat">
          <span className="stat-label">Days Until Reset</span>
          <span className="stat-value">3</span>
        </div>
      </div>
    </div>
  )
}

function getNextLeague(current: League): League {
  const leagueOrder: League[] = ['bronze', 'silver', 'gold', 'sapphire', 'ruby', 'emerald', 'amethyst', 'pearl', 'obsidian', 'diamond']
  const index = leagueOrder.indexOf(current)
  return leagueOrder[index + 1] || 'diamond'
}

function getPrevLeague(current: League): League {
  const leagueOrder: League[] = ['bronze', 'silver', 'gold', 'sapphire', 'ruby', 'emerald', 'amethyst', 'pearl', 'obsidian', 'diamond']
  const index = leagueOrder.indexOf(current)
  return leagueOrder[index - 1] || 'bronze'
}

export default DuolingoLeaderboard