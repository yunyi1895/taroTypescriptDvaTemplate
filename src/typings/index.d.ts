type IndexInterFace={
  count:Number
}
interface RequestOptions{
  method:keyof method,
  data:Object,
  url:String
}