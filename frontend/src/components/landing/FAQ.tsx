import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Feynman?",
    answer: "Feynman is an AI-powered visualization tool designed for students to learn physics and mathematics through interactive animations. Named after the famous physicist Richard Feynman, known for his ability to explain difficult ideas simply."
  },
  {
    question: "How does Feynman work?",
    answer: "Simply describe the physics or math concept you want to understand, and our AI will generate interactive visualizations and animations. You can explore concepts like wave interference, projectile motion, calculus derivatives, and more."
  },
  {
    question: "Who is Feynman for?",
    answer: "Feynman is perfect for high school and university students studying physics, mathematics, and engineering. Teachers and tutors also use it to create engaging visual explanations for their students."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-card/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            FAQ
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Still curious? Here are some answers to common questions.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border bg-card px-6"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
