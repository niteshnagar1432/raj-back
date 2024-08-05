import express from 'express';
import isAdmin from '../middlewares/isLogin.js';
import { addCallBack, getAllCallbacks, deleteCallBacks } from '../controllers/callbackController.js';

const router = express.Router();

router
    .route('/admin/callbacks')
    .get(isAdmin, getAllCallbacks)

// by id
router
    .route('/admin/callback/:id')
    .delete(isAdmin, deleteCallBacks)

router
    .route('/public/callback')
    .post(addCallBack)


export default router;