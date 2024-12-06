const axios = require('axios');
const FormData = require('form-data');
const logger = require('../config/logger');

const eventService = {
    list: async (req, res) => {
        try {
            // Spring 서버로 이벤트 목록을 요청
            const response = await axios.get(`${process.env.SPRING_URL}/api/event/list`);

            // Spring 서버로부터 받은 데이터
            const events = response.data;

            // 받은 데이터를 클라이언트에 반환
            res.json({ events });
        } catch (error) {
            logger.error('Error fetching event list from Spring server:', error);
            res.status(500).json({ error: '이벤트 목록을 가져오는 데 실패했습니다.' });
        }
    },

    registerEventConfirm: async (req, res) => {
        try {
            const formData = new FormData();
            
            formData.append('title', req.body.title);
            formData.append('url', req.body.url);
            formData.append('e_active', req.body.e_active);
            formData.append('description', req.body.description);
            formData.append('startDate', req.body.startDate);
            formData.append('endDate', req.body.endDate);

            const fileBuffer = req.file.buffer;
            formData.append('event_image', fileBuffer, {
                filename: req.file.originalname,
                contentType: req.file.mimetype
            });

            // Spring 서버로 POST 요청 보내기
            const response = await axios.post(
                `${process.env.SPRING_URL}/api/event/register`,
                formData,
                {
                    headers: {
                        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                    },
                }
            );

            if (response.status === 200) {
                res.status(200).json({ message: '이벤트가 성공적으로 등록되었습니다.' });
            } else {
                res.status(500).json({ message: '이벤트 등록에 실패했습니다.' });
            }
        } catch (error) {
            logger.error('Error registering event to Spring server:', error);
            res.status(500).json({ message: '이벤트 등록에 실패했습니다.' });
        }
    },

    modifyEventForm: async (req, res) => {
        try {
            const eventId = req.params.eventId;
            logger.info('eventID ::', eventId);
            // Spring 서버로 이벤트 수정 데이터를 요청
            const response = await axios.get(`${process.env.SPRING_URL}/api/event/modify/${eventId}`);
            const eventData = response.data;

            logger.info('eventData from Spring ::', eventData);

            // Spring 서버에서 받은 이벤트 데이터를 클라이언트로 반환
            res.json({eventData});
        } catch (error) {
            logger.error('Error fetching event data:', error);
            res.status(500).json({ message: '이벤트 데이터를 가져오는 데 실패했습니다.' });
        }
    },

    modifyEventConfirm: async (req, res) => {
        try {
            const eventId = req.params.eventId;
            const formData = new FormData();
    
            // 폼 데이터 준비
            formData.append('title', req.body.title);
            formData.append('url', req.body.url);
            formData.append('e_active', req.body.e_active);
            formData.append('description', req.body.description);
            formData.append('startDate', req.body.startDate);
            formData.append('endDate', req.body.endDate);
    
            // 파일이 존재하는 경우 파일 추가
            if (req.file) {
                const fileBuffer = req.file.buffer;
                formData.append('event_image', fileBuffer, {
                    filename: req.file.originalname,
                    contentType: req.file.mimetype
                });
            }
    
            // Spring 서버로 PUT 요청 보내기
            const response = await axios.put(
                `${process.env.SPRING_URL}/api/event/modifyConfirm/${eventId}`, // Spring 서버 URL
                formData,
                {
                    headers: {
                        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                    },
                }
            );
    
            // 성공적인 응답 처리
            if (response.status === 200) {
                res.status(200).json({ message: '이벤트가 성공적으로 수정되었습니다.' });
            } else {
                res.status(500).json({ message: '이벤트 수정에 실패했습니다.' });
            }
        } catch (error) {
            logger.error('Error modifying event:', error);
            res.status(500).json({ message: '이벤트 수정에 실패했습니다.' });
        }
    },

    eventStatus: async (req, res) => {
        try {
            const eventId = req.params.eventId;  
            const newStatus = req.body.newStatus;  
    
            logger.info(`eventId = ${eventId}, newStatus = ${newStatus}`);
    
            // Spring 서버로 상태 업데이트 요청 보내기
            const response = await axios.put(`${process.env.SPRING_URL}/api/event/statusConfirm/${eventId}`, {
                e_active: newStatus  
            });
    
            if (response.status === 200) {
                res.status(200).json({ message: '이벤트 상태가 성공적으로 변경되었습니다.' });
            } else {
                res.status(500).json({ message: '상태 변경에 실패했습니다.' });
            }
        } catch (error) {
            logger.error('Error updating event status:', error);
            res.status(500).json({ message: '상태 변경에 실패했습니다.' });
        }
    },

    deleteEventConfirm: async (req, res) => {
        try {
            const eventId = req.params.eventId;
            logger.info(`eventId = ${eventId}`);
        
            // Spring 서버로 삭제 요청 보내기
            const response = await axios.delete(`${process.env.SPRING_URL}/api/event/delete/${eventId}`);
        
            if (response.status === 200) {
                res.status(200).json({ message: '이벤트가 성공적으로 삭제되었습니다.' });
            } else {
                res.status(500).json({ message: '이벤트 삭제에 실패했습니다.' });
            }
        } catch (error) {
            logger.error('Error deleting event:', error);
            res.status(500).json({ message: '이벤트 삭제에 실패했습니다.' });
        }
    },
      
};

module.exports = eventService;
