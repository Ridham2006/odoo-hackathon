import { User } from '../models/models';
import { sign } from 'hono/jwt';
import bcrypt from 'bcryptjs';

export const signup = async (c: any) => {
  try {
    const { name, email, password, role } = await c.req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) return c.json({ error: 'User already exists' }, 400);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    return c.json({ message: 'User created successfully', user: { id: user._id, name, email, role } }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const login = async (c: any) => {
  try {
    const { email, password } = await c.req.json();
    const user = await User.findOne({ email });
    
    if (!user) return c.json({ error: 'Invalid credentials' }, 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return c.json({ error: 'Invalid credentials' }, 401);

    const token = await sign(
      { userId: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'transitops_super_secret'
    );

    return c.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
