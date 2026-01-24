import ProfileForm from "../components/profileForm";
const User = () => {
  return (
    <main className="p-4 sm:p-8 h-full grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-8 mt-6">
      <section className="hidden lg:block lg:col-span-1"></section>
      <section className="col-span-1 lg:col-span-6">
          <ProfileForm/>
      </section>
      <section className="hidden lg:block lg:col-span-1"></section>
    </main>
  );
};

export default User;
