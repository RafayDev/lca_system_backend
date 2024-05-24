import express from 'express';
import { getPermissions, addPermission, updatePermission, deletePermission, getPermission } from '../controllers/permissions.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

//make routes with auth middle ware
router.get('/',auth,getPermissions)
router.get('/:id',auth,getPermission)
router.post('/add',auth,addPermission);
router.post('/update/:id',auth,updatePermission);
router.delete('/delete/:id',auth,deletePermission);

export default router