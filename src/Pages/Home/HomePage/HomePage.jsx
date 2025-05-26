import { useContext } from 'react';
import Banner from '../../../components/Banner/Banner';
import BloodDonationFeatured from '../../../components/BloodDonationFeatured/BloodDonationFeatured';
import ContactUs from '../../../components/ContactUs/ContactUs';
import { AuthContext } from '../../../Firebase/AuthProvider';


function HomePage() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Banner
        title="Join the Life-Saving Cause"
        subtitle="Be a hero, donate blood today"
        image="https://i.postimg.cc/QN7b68ms/mt-1802-slider-img02.jpg"
        buttonText1={!user ? "Join as a donor" : null}
        buttonText2="Search donors"
      />
      <BloodDonationFeatured />
      <ContactUs
        contactNumber="01754659997"
        emailAddress="rhosnain@gmail.com"
      />
    </>
  );
}

export default HomePage;
