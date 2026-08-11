export const metadata = {
  title: "Privacy Policy - Vilva",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Placeholder content — replace with your actual policy before launch.
      </p>

      <div className="space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Information We Collect
          </h2>
          <p>
            When you submit an enquiry through this site, we collect your name, email
            address, phone number (if provided), and the message you send us. This
            information is used solely to respond to your enquiry.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            How We Use Your Information
          </h2>
          <p>
            We use the information you provide to respond to product enquiries and
            communicate with you about your interest in our products. We do not sell
            or share your information with third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Data Retention
          </h2>
          <p>
            Enquiry records are retained for as long as necessary to respond to and
            follow up on your request.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">Contact Us</h2>
          <p>
            If you have questions about this privacy policy, please contact us through
            the enquiry form on our product pages.
          </p>
        </section>
      </div>
    </div>
  );
}
