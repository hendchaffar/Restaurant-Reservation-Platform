import { useContext, useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { MdStarRate, MdStarOutline } from "react-icons/md";
import { AppContext } from "../context/app-context";
import { useAxios } from "../hooks/fetch-api.hook";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRatingChange(star)}
          className="focus:outline-none"
          aria-label={`Rate ${star} stars`}
        >
          {star <= rating ? (
            <MdStarRate className="text-yellow-400 text-2xl" />
          ) : (
            <MdStarOutline className="text-gray-400 text-2xl" />
          )}
        </button>
      ))}
    </div>
  );
};

const AddReview = () => {
  const { currentCompany, user } = useContext(AppContext);
  const { review } = useAxios(
    `companies/get/reviews/${user?.id}/${currentCompany?.id}`,
    "GET",
    {},
    "review",
    true
  );
  const { createReview } = useAxios(
    `companies/addreview/${currentCompany?.id}`,
    "POST",
    {},
    "createReview",
    false
  );

  const { updateReview } = useAxios(``, "PATCH", {}, "updateReview", false);

  const [form, setForm] = useState({
    rating: 0,
    comment: "",
    user: "",
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  useEffect(() => {
    if (review.responseData && !review.error) {
      setForm({
        rating: review.responseData.reviews[0].rating,
        comment: review.responseData.reviews[0].comment,
        user: review.responseData.reviews[0].user,
      });
    }
  }, [review.responseData]);
  const handleSubmit = () => {
    if (review.responseData) {
      updateReview.submitRequest(
        {
          rating: form.rating,
          comment: form.comment,
        },
        `reviews/${review.responseData.reviews[0].id}`,
        true
      );
    } else {
      createReview.submitRequest(
        {
          user: user,
          rating: form.rating,
          comment: form.comment,
        },
        "",
        true
      );
    }
  };

  const handleCancel = () => {
    setForm({ rating: 0, comment: "", user: "" });
  };

  const handleRatingChange = (newRating: number) => {
    setForm({ ...form, rating: newRating });
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value;
    setForm({ ...form, comment: newComment });
  };

  return (
    <>
      <Button
        isIconOnly
        onPress={onOpen}
        variant="light"
        className="text-white"
      >
        <MdStarRate size={27} />
      </Button>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="w-full max-w-[600px] max-h-[90vh] overflow-y-auto p-5"
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Rate {currentCompany?.name} {currentCompany?.type}
              </ModalHeader>
              <ModalBody className="max-h-[70vh] overflow-y-auto">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Rating
                  </label>
                  <StarRating
                    rating={form.rating}
                    onRatingChange={handleRatingChange}
                  />
                </div>
                <Textarea
                  label="Comment"
                  placeholder="Write your comment here..."
                  value={form.comment}
                  //@ts-ignore
                  onChange={handleCommentChange}
                  minRows={3}
                  maxRows={5}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="shadow"
                  isDisabled={form.rating == 0}
                  onClick={handleSubmit}
                  onPress={onClose}
                >
                  Submit
                </Button>
                <Button
                  color="danger"
                  variant="shadow"
                  onClick={handleCancel}
                  onPress={onClose}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddReview;
