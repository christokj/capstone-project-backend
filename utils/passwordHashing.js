import bcrypt from 'bcrypt';

export const passHashing = async pass => {

    //hashing
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);

    return bcrypt.hashSync(pass, salt);
}