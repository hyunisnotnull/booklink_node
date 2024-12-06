const express = require('express');
const router = express.Router();
const eventService = require('../lib/service/eventService');
const uploads = require('../lib/upload/uploads');
const logger = require('../lib/config/logger');

// 이벤트 목록 페이지
router.get('/list', (req, res) => {
    logger.info('/event/list');
    eventService.list(req, res);
});

// 이벤트 등록 처리
router.post('/register_event_confirm', uploads.UPLOAD_EVENT_IMAGES_MIDDLEWARE(), (req, res) => {
    logger.info('/event/register_event_confirm');
    eventService.registerEventConfirm(req, res);
});

// 이벤트 수정 폼
router.get('/modify_event_form/:eventId', (req, res) => {
    logger.info('/event/modify_event_form');
    eventService.modifyEventForm(req, res);
});

// 이벤트 수정 처리
router.put('/modify_event_confirm/:eventId', uploads.UPLOAD_EVENT_IMAGES_MIDDLEWARE(), (req, res) => {
    logger.info('/event/modify_event_confirm');
    eventService.modifyEventConfirm(req, res);
});

// 이벤트 상태 변경 처리
router.put('/event_status/:eventId', (req, res) => {
    logger.info('/event/event_status');
    eventService.eventStatus(req, res);
});

// 이벤트 삭제 처리
router.delete('/delete_event_confirm/:eventId', (req, res) => {
    logger.info('/event/delete_event_confirm');
    eventService.deleteEventConfirm(req, res);
});

module.exports = router;
