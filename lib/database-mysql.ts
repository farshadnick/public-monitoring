import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'mysql',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER || 'monitoring',
      password: process.env.MYSQL_PASSWORD || 'monitoring_password',
      database: process.env.MYSQL_DATABASE || 'monitoring',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

export async function initDB() {
  const connection = await getPool().getConnection();
  
  try {
    // Create monitoring_results table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS monitoring_results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        url VARCHAR(500) NOT NULL,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(20) NOT NULL,
        response_time DOUBLE,
        status_code INT,
        ssl_days_remaining INT,
        uptime DOUBLE,
        checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_url_checked (url(255), checked_at DESC),
        INDEX idx_checked_at (checked_at DESC)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
  } finally {
    connection.release();
  }
}

export interface MonitoringResult {
  id?: number;
  url: string;
  name: string;
  status: 'up' | 'down' | 'unknown';
  response_time: number;
  status_code: number;
  ssl_days_remaining: number | null;
  uptime: number;
  checked_at?: string;
  created_at?: string;
}

export async function saveMonitoringResult(result: MonitoringResult): Promise<void> {
  const connection = await getPool().getConnection();
  
  try {
    await connection.query(
      `INSERT INTO monitoring_results 
      (url, name, status, response_time, status_code, ssl_days_remaining, uptime, checked_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        result.url,
        result.name,
        result.status,
        result.response_time,
        result.status_code,
        result.ssl_days_remaining,
        result.uptime,
        result.checked_at || new Date().toISOString(),
      ]
    );
  } finally {
    connection.release();
  }
}

export async function getRecentResults(url: string, limit: number = 100): Promise<MonitoringResult[]> {
  const connection = await getPool().getConnection();
  
  try {
    const [rows] = await connection.query(
      `SELECT * FROM monitoring_results 
      WHERE url = ? 
      ORDER BY checked_at DESC 
      LIMIT ?`,
      [url, limit]
    );
    
    return rows as MonitoringResult[];
  } finally {
    connection.release();
  }
}

export async function getAllRecentResults(limit: number = 1000): Promise<MonitoringResult[]> {
  const connection = await getPool().getConnection();
  
  try {
    const [rows] = await connection.query(
      `SELECT * FROM monitoring_results 
      ORDER BY checked_at DESC 
      LIMIT ?`,
      [limit]
    );
    
    return rows as MonitoringResult[];
  } finally {
    connection.release();
  }
}

export async function getUptimeStats(url: string, hours: number = 24): Promise<any> {
  const connection = await getPool().getConnection();
  
  try {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const [rows] = await connection.query(
      `SELECT 
        COUNT(*) as total_checks,
        SUM(CASE WHEN status = 'up' THEN 1 ELSE 0 END) as successful_checks,
        AVG(response_time) as avg_response_time,
        MIN(response_time) as min_response_time,
        MAX(response_time) as max_response_time
      FROM monitoring_results 
      WHERE url = ? AND checked_at >= ?`,
      [url, since]
    );
    
    return (rows as any[])[0];
  } finally {
    connection.release();
  }
}

export async function getHistoricalData(url: string, hours: number = 24): Promise<MonitoringResult[]> {
  const connection = await getPool().getConnection();
  
  try {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const [rows] = await connection.query(
      `SELECT * FROM monitoring_results 
      WHERE url = ? AND checked_at >= ?
      ORDER BY checked_at ASC`,
      [url, since]
    );
    
    return rows as MonitoringResult[];
  } finally {
    connection.release();
  }
}

export async function cleanOldResults(daysToKeep: number = 30): Promise<void> {
  const connection = await getPool().getConnection();
  
  try {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    
    await connection.query(
      `DELETE FROM monitoring_results 
      WHERE checked_at < ?`,
      [cutoffDate]
    );
  } finally {
    connection.release();
  }
}

// Close database connection
export async function closeDB(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

