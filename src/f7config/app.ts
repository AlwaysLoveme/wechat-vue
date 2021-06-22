// handler Native App width capacitor
import Framework7 from "framework7/types";
import { f7 as F7 } from "framework7-vue";

const app = {
  f7: F7,
  /*
  This method prevents back button tap to exit from app on android.
  In case there is an opened modal it will close that modal instead.
  In case there is a current view with navigation history, it will go back instead.
  */
  handleHistory(): void {
    const f7 = app.f7;
    const $ = f7.$;

    window.addEventListener(
      "popstate",
      function () {
        if ($(".actions-modal.modal-in").length) {
          f7.actions.close(".actions-modal.modal-in");
          return;
        }
        if ($(".dialog.modal-in").length) {
          f7.dialog.close(".dialog.modal-in");
          return;
        }
        if ($(".sheet-modal.modal-in").length) {
          f7.sheet.close(".sheet-modal.modal-in");
          return;
        }
        if ($(".popover.modal-in").length) {
          f7.popover.close(".popover.modal-in");
          return;
        }
        if ($(".popup.modal-in").length) {
          if ($(".popup.modal-in>.view").length) {
            const currentView = f7.views.get(".popup.modal-in>.view");
            if (
              currentView &&
              currentView.router &&
              currentView.router.history.length > 1
            ) {
              currentView.router.back();
              return;
            }
          }
          f7.popup.close(".popup.modal-in");
          return;
        }
        if ($(".login-screen.modal-in").length) {
          f7.loginScreen.close(".login-screen.modal-in");
          return;
        }

        if ($(".page-current .searchbar-enabled").length) {
          f7.searchbar.disable(".page-current .searchbar-enabled");
          return;
        }

        if ($(".page-current .card-expandable.card-opened").length) {
          f7.card.close(".page-current .card-expandable.card-opened");
          return;
        }

        if ($(".panel.panel-in").length) {
          f7.panel.close(".panel.panel-in");
        }
      },
      false
    );
  },
  init(f7: Framework7): void {
    // Save f7 instance
    app.f7 = f7;
    // Handle Android back button
    app.handleHistory();
  },
};

export default app;
