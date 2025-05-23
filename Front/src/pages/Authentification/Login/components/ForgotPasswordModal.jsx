import { IoMdClose } from "react-icons/io";

const ForgotPasswordModal = ({ onClose, resetEmail, setResetEmail, handleResetPassword }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <button onClick={onClose}>
        <IoMdClose className="modal-close-icon" />
      </button>
      <form onSubmit={handleResetPassword} className="reset-form">
        <div className="field">
          <label className="label" htmlFor="resetEmail">
            Entrez votre email pour réinitialiser votre mot de passe :
          </label>
          <div className="control">
            <input className="input" type="email" id="resetEmail" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required placeholder="Email de récupération" />
          </div>
        </div>
        <div className="field">
          <button className="btn send-email-btn is-small" type="submit">
            Envoyer
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default ForgotPasswordModal;
