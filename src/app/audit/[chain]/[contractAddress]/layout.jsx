const Layout = (props) => {
  const { children, params } = props;
  setTimeout(async() => {
    const p = await params;
    console.log(`ini di server layout`);
    console.log(p.contractAddress);
  }, 2000);
  return <>{children}</>;
};

export default Layout;
