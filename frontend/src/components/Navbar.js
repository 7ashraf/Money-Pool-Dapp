const Navbar = ({currentAccount})=>{
    return(
        <header>
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <a class="navbar-brand" href="/">Money Pool</a>
            <a class="nav-link dark" href="/">Welcome ! {currentAccount} </a>

            
            </nav>
        </header>
    )
}
export default Navbar