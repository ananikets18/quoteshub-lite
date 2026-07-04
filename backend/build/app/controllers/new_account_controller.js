import User from '#models/user';
import { signupValidator } from '#validators/user';
import UserTransformer from '#transformers/user_transformer';
export default class NewAccountController {
    async store({ request, serialize }) {
        const payload = await request.validateUsing(signupValidator);
        const user = await User.create({
            name: payload.fullName,
            email: payload.email,
            password: payload.password,
        });
        const token = await User.accessTokens.create(user);
        return serialize({
            user: UserTransformer.transform(user),
            token: token.value.release(),
        });
    }
}
//# sourceMappingURL=new_account_controller.js.map