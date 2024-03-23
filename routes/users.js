import express from 'express';
import {register,login,getUsers,addUser,updateUser,deleteUser,getUser} from '../controllers/users.js';

const router = express.Router();

router.get('/',getUsers)
router.get('/:id',getUser)
router.post('/register', register);
router.post('/login', login);
router.post('/add', addUser);
router.patch('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);


export default router;