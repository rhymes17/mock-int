import Link from "next/link";

const Dashboard = () => {
  return (
    <div>
      Dashboard
      <Link href="/interviews">
        <h3 className="">Inter</h3>
      </Link>
    </div>
  );
};

export default Dashboard;
