import express from 'express';
import isAdmin from '../middlewares/isLogin.js';
import { addContactUs, getAllContactUs, deleteContactUs } from '../controllers/contactUsController.js';
import e from 'express';

const router = express.Router();

router
    .route('/admin/contacts')
    .get(isAdmin, getAllContactUs)

// by id
router
    .route('/admin/contact/:id')
    .delete(isAdmin, deleteContactUs)

router
    .route('/public/contact')
    .post(addContactUs)


export default router;