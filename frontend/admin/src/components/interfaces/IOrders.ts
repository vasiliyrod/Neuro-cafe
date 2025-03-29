import IDish from "./IDish";

interface IOrders {
    id:string;
    dishes:
    {
        dish:IDish;
        count:number;
    }[];
    date:Date;
    status:"pending"|"in_progress"|"completed";
    table_id:string;
    user_id:string;
  }
  
  export default IOrders;
  