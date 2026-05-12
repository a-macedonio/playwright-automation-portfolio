export type ArticlePayload = {
  title: string;
  description: string;
  body: string;
  tagList: string[];
};

export type DisplayedArticleData = Omit<ArticlePayload, 'description'> & {
  author: string;
};