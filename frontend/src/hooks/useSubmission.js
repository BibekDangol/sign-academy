import { useRef, useState } from 'react';

// The ref also blocks repeated clicks before React renders the busy state.
export default function useSubmission() {
  const busy = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const run = async action => {
    if (busy.current) return;
    busy.current = true;
    setSubmitting(true);
    try { return await action(); }
    finally {
      busy.current = false;
      setSubmitting(false);
    }
  };
  return { submitting, run };
}
