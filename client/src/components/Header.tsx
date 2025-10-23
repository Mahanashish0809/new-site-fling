import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Search, Zap } from "lucide-react";
import { Link } from "react-router-dom";

// 1. Import the modal hook
import { useModal } from "@/contexts/ModalContext";

export const Header = () => {
  // 2. Get BOTH functions to open the modals
  const { openContactModal, openAboutModal } = useModal();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-gray-900/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo + Navigation Row */}
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 group">
            <span className="text-4xl font-extrabold text-[#0A2540] dark:text-white transition-colors leading-none group-hover:text-[#FF6B35]">
              Jolt
            </span>
            <div className="relative h-10 w-10 transition-transform duration-200 group-hover:scale-105">
              <Search
                className="h-10 w-10 text-[#FF6B35]"
                strokeWidth={2.5}
                fill="black"
              />
              <Zap
                className="absolute top-[10px] left-[10px] h-4 w-4 text-white fill-white"
                strokeWidth={2}
              />
            </div>
          </Link>

          {/* Navigation Links */}
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-8">
              {/* Features with Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-[15px] font-medium text-[#0A2540] dark:text-white hover:text-[#FF6B35] transition-colors">
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white dark:bg-gray-800 p-4 rounded shadow-lg">
                  <ul className="flex flex-col gap-2 min-w-[180px]">
                    <li>
                      <Link
                        to="/features/performance"
                        className="block text-sm text-[#0A2540] dark:text-white hover:text-[#FF6B35] transition-colors"
                      >
                        Performance
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/features/pathly"
                        className="block text-sm text-[#0A2540] dark:text-white hover:text-[#FF6B35] transition-colors"
                      >
                        Pathly
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Contact Us Button */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <button
                    type="button"
                    onClick={openContactModal}
                    className="text-[15px] font-medium text-[#0A2540] dark:text-white transition-colors hover:text-[#FF6B35] hover:underline underline-offset-4"
                  >
                    Contact Us
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* 3. MODIFIED THIS SECTION FOR 'ABOUT US' */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  {/* Changed <Link> to <button> and added onClick */}
                  <button
                    type="button"
                    onClick={openAboutModal} 
                    className="text-[15px] font-medium text-[#0A2540] dark:text-white transition-colors hover:text-[#FF6B35] hover:underline underline-offset-4"
                  >
                    About Us
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/help"
                    className="text-[15px] font-medium text-[#0A2540] dark:text-white transition-colors hover:text-[#FF6B35] hover:underline underline-offset-4"
                  >
                    Help
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            asChild
            className="text-black bg-transparent hover:text-white hover:bg-green-600 dark:text-white dark:hover:bg-green-600"
          >
            <Link to="/login">Login</Link>
          </Button>
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-black hover:text-black"
          >
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};