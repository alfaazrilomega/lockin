"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

const QuestionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="rgb(49, 16, 129)" style={{ width: '14px', height: '14px' }}>
    <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
  </svg>
)

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" style={{ width: '20px', height: '20px' }}>
    <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
  </svg>
)

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" style={{ width: '20px', height: '20px' }}>
    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
  </svg>
)

const faqItems = [
  {
    question: 'What is included in the Starter plan?',
    answer: 'The Starter plan includes unlimited analytics usage, premium support, customer care, and collaboration tools—everything you need to get started!',
  },
  {
    question: 'Do you offer a free trial?',
    answer: 'Yes! Our Pro plan includes a free trial so you can explore all the features before committing.',
  },
  {
    question: 'Can I switch plans later?',
    answer: 'Absolutely! You can upgrade or downgrade your plan at any time without any hassle.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, and for Enterprise plans, we also support invoicing and wire transfers.',
  },
  {
    question: 'How secure is my data?',
    answer: 'Your data is protected with enterprise-grade security measures, including encryption and regular audits, ensuring maximum safety.',
  },
  {
    question: 'How does the 2% donation work?',
    answer: 'We allocate 2% of all memberships directly to pediatric well-being organizations, helping make a difference with every subscription.',
  },
  {
    question: 'Can I integrate this platform with other tools?',
    answer: 'Absolutely! Our platform supports integrations with popular CRMs and business tools, allowing for seamless workflows.',
  },
  {
    question: 'What makes your platform different?',
    answer: 'Our focus is on user-friendly design, actionable insights, and top-notch customer support—giving you everything you need to grow.',
  },
]

interface FAQItemProps {
  item: typeof faqItems[0]
  isOpen: boolean
  onClick: () => void
  index: number
}

function FAQItem({ item, isOpen, onClick, index }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.5, delay: 0.05 * index }}
      onClick={onClick}
      className="cursor-pointer"
      style={{
        padding: '20px 24px',
        borderRadius: '16px',
        background: isOpen ? 'rgba(246, 241, 252, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Question */}
      <div className="flex items-center justify-between gap-4">
        <span
          style={{
            fontFamily: 'Satoshi, Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 500,
            color: 'rgb(28, 22, 41)',
          }}
        >
          {item.question}
        </span>
        <div
          style={{
            color: 'rgb(49, 16, 129)',
            flexShrink: 0,
          }}
        >
          {isOpen ? <CloseIcon /> : <PlusIcon />}
        </div>
      </div>

      {/* Answer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'rgba(28, 22, 41, 0.6)',
                margin: '16px 0 0 0',
              }}
            >
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="w-full px-8 md:px-16" id="faq">
      <div className="relative z-10 mx-auto max-w-5xl text-left">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-12 gap-6 w-full">
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center mb-6"
              style={{
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(49, 16, 129, 0.1)',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <QuestionIcon />
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'rgb(49, 16, 129)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                FAQ
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontFamily: 'Satoshi, Inter, sans-serif',
                fontSize: '44px',
                fontWeight: 500,
                lineHeight: 1.3,
                color: 'rgb(28, 22, 41)',
                margin: '0 0 16px 0',
              }}
            >
              Questions answered
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: 1.6,
                color: 'rgba(28, 22, 41, 0.6)',
                maxWidth: '450px',
                margin: 0,
              }}
            >
              We&apos;re here to help you and solve objections. Find answers to the most common questions below.
            </motion.p>
          </div>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {faqItems.map((item, index) => (
            <FAQItem
              key={item.question}
              item={item}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              index={index}
            />
          ))}
        </div>


      </div>
    </div>
  )
}
