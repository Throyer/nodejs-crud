import Paginator from "./Paginator";

export interface PageableParams<T> {

	/**
	 * Resultado da consulta no typeOrm (resultado da consulta junto com o count).
	 */
	select: [T[], number];

	/**
	 * Query Params com os parametros de paginação.
	 */
	pageable: Paginator;
}

export class Page<T> {
	content: T[];
	page: number;
	size: number;
	totalPages: number;
	totalElements: number;

	constructor({ select, pageable }: PageableParams<T> = {
		select: [[], 0],
		pageable: {
			page: 1,
			size: 10,
			paginate: () => undefined
		}
	}) {

		const [content, count] = select;
		this.content = content;
		this.page = pageable.page;
		this.size = pageable.size;
		this.totalPages = Math.ceil(count / pageable.size);
		this.totalElements = count;
	}
}