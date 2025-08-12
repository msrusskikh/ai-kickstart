import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore } from './progress';
import { useCommandMenu } from './command-menu';
import { modules } from './content';

export function useKeyboardShortcuts() {
  const router = useRouter();
  const { currentModule, currentSection, setCurrentLesson } = useProgressStore();
  const { open: openCommandMenu } = useCommandMenu();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      try {
        // Ignore shortcuts when typing in input fields
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
          return;
        }

        // Command menu: K or Cmd+K
        if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          openCommandMenu();
          return;
        }

        // Command menu: K key
        if (event.key === 'k' && !event.metaKey && !event.ctrlKey) {
          event.preventDefault();
          openCommandMenu();
          return;
        }

        // Next lesson: J, L, or Arrow Right
        if (event.key === 'j' || event.key === 'l' || event.key === 'ArrowRight') {
          event.preventDefault();
          const currentModuleData = modules.find(m => m.id === currentModule);
          if (currentModuleData) {
            const nextSection = currentModuleData.sections.find(s => s.section === currentSection + 1);
            if (nextSection) {
              setCurrentLesson(currentModule, currentSection + 1);
              router.push(`/learn/${currentModule}/${currentSection + 1}`);
            } else if (currentModule < modules.length) {
              // Go to next module, first section
              setCurrentLesson(currentModule + 1, 1);
              router.push(`/learn/${currentModule + 1}/1`);
            }
          }
          return;
        }

        // Previous lesson: H, K, or Arrow Left
        if (event.key === 'h' || event.key === 'k' || event.key === 'ArrowLeft') {
          event.preventDefault();
          if (currentSection > 1) {
            setCurrentLesson(currentModule, currentSection - 1);
            router.push(`/learn/${currentModule}/${currentSection - 1}`);
          } else if (currentModule > 1) {
            // Go to previous module, last section
            const prevModule = modules.find(m => m.id === currentModule - 1);
            if (prevModule) {
              const lastSection = prevModule.sections[prevModule.sections.length - 1];
              setCurrentLesson(currentModule - 1, lastSection.section);
              router.push(`/learn/${currentModule - 1}/${lastSection.section}`);
            }
          }
          return;
        }

        // Go to modules overview: G then M
        if (event.key === 'g') {
          // TODO: Implement G then M sequence
          return;
        }
      } catch (error) {
        console.warn('Keyboard shortcut error:', error);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, currentModule, currentSection, setCurrentLesson, openCommandMenu]);
}
