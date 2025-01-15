import {
    userButton
} from "./userButton"
import {
    userDetailsForm
} from "./userDetailsForm"

export const freModal = () => {
    return /*html*/ `
<!-- Open the modal using ID.showModal() method -->
<dialog id="fre_modal" class="modal modal-bottom lg:modal-middle border border-base-300">
    <div class="modal-box flex flex-col">
        <h3 class="font-bold text-lg text-center mt-16">Welcome to Digglu!</h3>
        <p class="my-4">Let's get you setup. This profile button is how others see you on your posts and comments.</p>

        ${userButton()}

        <form method="dialog">
            <button class="btn btn-square absolute right-6 top-6">✕</button>
        </form>

        ${userDetailsForm()}
    </div>
</dialog>
`
}