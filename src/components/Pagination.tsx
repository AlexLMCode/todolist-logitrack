
export const Pagination = ({ totalTodos, todosPerPage, setCurrentPage,currentPage }: { currentPage:number,totalTodos: number, todosPerPage: number, setCurrentPage:(page:number)=>void }) => {
    let pages = [];

    for (let int = 1; int <= Math.ceil(totalTodos / todosPerPage); int++) {
        pages.push(int)

    }

    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination"> 
                {
                    pages && pages.map((page, index) => (
                        <li className={`page-item ${page == currentPage ? 'active' : ''}`}><a className="page-link" key={index} onClick={()=>setCurrentPage(page)}>{page}</a></li>
                    ))
                }
            </ul>
        </nav>
    )
}
