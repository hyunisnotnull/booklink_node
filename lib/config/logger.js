const winston = require('winston');
const path = require('path');
const fs = require('fs');
const DailyRotateFile = require('winston-daily-rotate-file');

// 외부 로그 디렉토리 경로 설정
const logDir = process.env.LOGGING_PATH;

// 외부 디렉토리가 없으면 생성
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 날짜별 로그 파일을 저장할 트랜스포트 설정
const createTransport = (level) => new DailyRotateFile({
  filename: path.join(logDir, `${level}`, '%DATE%.log'),        // 로그 파일을 날짜별로 관리
  datePattern: 'YYYY-MM-DD',                                    // 날짜 포맷 (예: 2024-12-06)
  maxSize: '20m',                                               // 로그 파일 크기 제한 (20MB 초과하면 새로운 파일로 기록)
  maxFiles: '14d',                                              // 최근 14일 동안의 로그 파일만 유지
  zippedArchive: true,                                          // 오래된 로그 파일을 압축하여 보관
  level: level,                                                 // 각 레벨에 맞는 로그 저장
});

// winston 로거 설정
const logger = winston.createLogger({
  level: 'info',                                                // 기본 로그 레벨 설정
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    // 레벨별로 로그를 기록할 트랜스포트 설정
    createTransport('error'),
    createTransport('warn'),
    createTransport('info'),

    // 콘솔에 출력 (디버깅 또는 실시간 확인용)
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});


module.exports = logger;
