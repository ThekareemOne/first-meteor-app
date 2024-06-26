import React from "react";
import { createRoot } from "react-dom/client";
import { Meteor } from "meteor/meteor";
import { App } from "/imports/ui/App";
import { QueryClient, QueryClientProvider } from "react-query";

Meteor.startup(() => {
  const queryClient = new QueryClient();

  const container = document.getElementById("react-target");
  const root = createRoot(container!);
  root.render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
});
