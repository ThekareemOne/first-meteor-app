import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { useState } from "react";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useTracker(() => {
    const user = Meteor.user();
    setIsAuthenticated(!!user);
  }, [isAuthenticated]);

  return isAuthenticated;
};

export default useAuth;
