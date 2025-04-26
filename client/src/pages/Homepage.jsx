import NavBar from "../components/NavBar";

const Homepage = () => {
  return (
    <>
      <NavBar />
      <main className="homepage">
        <div className="homepage__content">
          <h1>Welcome to the Homepage</h1>
          <p>This is the main content area.</p>
        </div>
      </main>
    </>
  );
}

export default Homepage;