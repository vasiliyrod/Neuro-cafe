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
  }
  
  export default IOrders;
  