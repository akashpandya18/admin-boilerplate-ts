import { ServerApi } from '@/app/api/server-calls';
import Gym from '@/components/PageComponents/GymPage';

async function getData() {
  const usersRes = await ServerApi.getGymDetails();
  return usersRes;
}

export default async function Page() {
  const data = await getData();
  return <Gym data={data || []} />;
}
