import express from 'express';
import {register,login,getUsers,addUser,updateUser,deleteUser,getUser} from '../controllers/users.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/',auth,getUsers)
router.get('/:id',auth,getUser)
router.post('/register', register);
router.post('/login', login);
router.post('/add',auth, addUser);
router.patch('/update/:id',auth, updateUser);
router.delete('/delete/:id',auth, deleteUser);


export default router;