import Navbar from '../../pages/Navbar';
import Footer from '../../pages/Footer';

export default function PageLayout({ children }) {
  return <><Navbar />{children}<Footer /></>;
}
