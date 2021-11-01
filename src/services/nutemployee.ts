import api from "./api";
import IUserData from "../types/users";

class TutorialDataService {
    getAll() {
      return api.get("/nutemployee");
    }
  
    get(id: string) {
      return  api.get(`/nutemployee/${id}`);
    }
  
    create(data: IUserData) {
      return api.post("/nutemployee", data);
    }
  
    update(data: IUserData, id: any) {
      return api.put(`/nutemployee/${id}`, data);
    }
  
    delete(id: any) {
      return api.delete(`/nutemployee/${id}`);
    }
  }
  
  export default new TutorialDataService();