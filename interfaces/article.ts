import {Document, Model} from 'mongoose';

export interface IArticle extends Document{
    title: string;
    content: string;
    date: string;
    image: string;
}

export interface IArticleModel extends Model<IArticle>{
  //Definiciones aqui
}