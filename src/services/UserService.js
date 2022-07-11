import axios from 'axios';

const USER_API_BASE_URL = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";


class UserService {
   
    getUsers(){
        return axios.get(USER_API_BASE_URL);
    }

}
export default new UserService()
