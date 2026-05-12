export type ArticleFormData = {
    title: string;
    description: string;
    body: string;
    tags: string[];
};

export type ArticleEditorValues = Omit<ArticleFormData, 'tags'>;

export type DisplayedArticleData = Omit<ArticleFormData, 'description'> & {
    author: string;
};