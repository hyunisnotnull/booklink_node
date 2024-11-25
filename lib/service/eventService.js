const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const eventService = {
    list: async (req, res) => {
        try {
            // Spring 서버로 이벤트 목록을 요청
            const response = await axios.get(`${process.env.SPRING_URL}/api/event/list`);

            // Spring 서버로부터 받은 데이터
            const events = response.data;
            console.log('events:::', events);

            // 받은 데이터를 클라이언트에 반환
            res.json({ events });
        } catch (error) {
            console.error('Error fetching event list from Spring server:', error);
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
            console.error('Error registering event to Spring server:', error);
            res.status(500).json({ message: '이벤트 등록에 실패했습니다.' });
        }
    },

    modifyEventForm: async (req, res) => {
        try {
            // Spring 서버로 이벤트 수정 데이터를 요청
            const response = await axios.get(`${process.env.SPRING_URL}/api/event/modify/${req.params.id}`);
            const eventData = response.data;

            // Spring 서버에서 받은 이벤트 데이터를 클라이언트로 반환
            res.json({
                e_title: eventData.title,
                e_image: eventData.imageUrl,  // 이미지는 URL로 반환한다고 가정
                e_url: eventData.url,
                e_active: eventData.active,
                e_desc: eventData.description,
                e_start_date: eventData.startDate,
                e_end_date: eventData.endDate
            });
        } catch (error) {
            console.error('Error fetching event data:', error);
            res.status(500).json({ message: '이벤트 데이터를 가져오는 데 실패했습니다.' });
        }
    },

    modifyEventConfirm: (req, res) => {
        
    },

    eventStatus: (req, res) => {
       
    },

    deleteEventConfirm: (req, res) => {
       
    },
};

module.exports = eventService;
