export class Pagination {
    currentPage: number=0;
    pageSize: number=0;
    totalCount: number=0;
    totalPages: number=0;
}

export class PagedList<T> extends Pagination {
    list:Array<T>=new Array<T>;
}
