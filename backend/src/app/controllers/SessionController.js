import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails.' });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'Password does not match' });
      }

      const { id, name, verified } = user;

      if (verified === false) {
        return res.status(400).json({
          error: 'You have to verify your email to be able to log in.',
        });
      }

      return res.json({
        user: { id, name, email },
        token: jwt.sign({ id }, process.env.TOKEN_SECRET, {
          expiresIn: process.env.TOKEN_EXPIRATION,
        }),
      });
    } catch (err) {
      return res.json(err);
    }
  }
}

export default new SessionController();
