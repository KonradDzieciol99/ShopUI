export interface ICategoryOfProduct {
    id: number;
    categoryName: string;
}
export interface ICategoryOfProductCheckbox extends ICategoryOfProduct {
    checked:boolean;
}
