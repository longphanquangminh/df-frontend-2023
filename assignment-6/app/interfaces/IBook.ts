import ITopic from './ITopic';

export default interface IBook {
  id: number;
  name: string;
  author: string;
  topic: ITopic;
}
