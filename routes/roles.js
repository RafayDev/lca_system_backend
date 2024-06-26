import express from 'express';
import { getRoles, addRole, updateRole, deleteRole, getRole, getRolePermissions, assignPermissionsToRole } from '../controllers/roles.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

//make routes with auth middle ware
router.get('/',auth,getRoles)
router.get('/:id',auth,getRole)
router.post('/add',auth,addRole);
router.post('/update/:id',auth,updateRole);
router.delete('/delete/:id',auth,deleteRole);
router.get('/permissions/:id',auth,getRolePermissions);
router.post('/assignPermissions',auth,assignPermissionsToRole);

export default router