import ProfileForm from "../components/profileForm";
const User = () => {
  return (
    <main className="p-8 h-full grid grid-cols-8 gap-8 mt-6 ">
      <section className="col-span-1  "></section>
      <section className="col-span-6  border-solid rounded-[10px] border border-gray-200 shadow-md ">
          <ProfileForm/>
      </section>
      <section className="col-span-1 "></section>
    </main>
  );
};

export default User;
