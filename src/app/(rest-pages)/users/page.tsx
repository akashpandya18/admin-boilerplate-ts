import { ServerApi } from '@/app/api/server-calls';
import Users from '@/components/PageComponents/UserPage';

async function getData() {
  const usersRes = await ServerApi.getUsers();
  return usersRes;
}

export default async function Page() {
  const data = await getData();
  return <Users data={data || []} />;
}
